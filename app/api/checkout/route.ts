import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { stripe, calculatePricing, PLATFORM_FEE_PERCENT } from "@/lib/stripe"

// POST /api/checkout - Create Stripe checkout session for a booking
export async function POST(req: Request) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: "Payment processing not configured. Contact support." },
        { status: 503 }
      )
    }

    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { bookingId } = body

    if (!bookingId) {
      return NextResponse.json(
        { error: "Missing bookingId" },
        { status: 400 }
      )
    }

    // Get booking with listing and host details
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            location: true,
            price: true,
            imageSrc: true,
            images: true,
            host: {
              select: {
                id: true,
                stripeAccountId: true,
                stripeOnboardingComplete: true,
              },
            },
          },
        },
        payment: true,
      },
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Verify ownership
    if (booking.guestId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check if already paid
    if (booking.payment?.status === "succeeded") {
      return NextResponse.json(
        { error: "Booking already paid" },
        { status: 400 }
      )
    }

    // Check booking status
    if (booking.status === "cancelled") {
      return NextResponse.json(
        { error: "Cannot pay for cancelled booking" },
        { status: 400 }
      )
    }

    // Calculate nights
    const nights = Math.ceil(
      (booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24)
    )

    const pricing = calculatePricing(booking.listing.price, nights)

    // Get image for checkout
    const imageUrl = booking.listing.images?.[0] || booking.listing.imageSrc || undefined

    // Check if host has connected their Stripe account
    const hostStripeAccountId = booking.listing.host?.stripeAccountId
    const hostOnboardingComplete = booking.listing.host?.stripeOnboardingComplete

    // Build checkout session options
    const checkoutOptions: Parameters<typeof stripe.checkout.sessions.create>[0] = {
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: session.user.email || undefined,
      client_reference_id: booking.id,
      metadata: {
        bookingId: booking.id,
        listingId: booking.listing.id,
        guestId: session.user.id,
        hostId: booking.listing.host?.id || "",
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: booking.listing.title,
              description: `${nights} night${nights > 1 ? "s" : ""} at ${booking.listing.location}`,
              images: imageUrl ? [imageUrl] : undefined,
            },
            unit_amount: Math.round(booking.listing.price * 100), // cents
          },
          quantity: nights,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/booking/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/booking/cancel?booking_id=${booking.id}`,
    }

    // If host has connected Stripe, use Connect to split payments
    if (hostStripeAccountId && hostOnboardingComplete) {
      // Calculate platform fee (10% of total)
      const applicationFeeAmount = Math.round(pricing.totalPriceCents * (PLATFORM_FEE_PERCENT / 100))

      checkoutOptions.payment_intent_data = {
        // This automatically transfers funds to the host minus our fee
        application_fee_amount: applicationFeeAmount,
        transfer_data: {
          destination: hostStripeAccountId,
        },
      }
    }
    // If host hasn't connected, payment goes to platform (manual payout later)

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create(checkoutOptions)

    // Create or update payment record
    if (booking.payment) {
      await db.payment.update({
        where: { id: booking.payment.id },
        data: {
          stripeSessionId: checkoutSession.id,
          status: "pending",
        },
      })
    } else {
      await db.payment.create({
        data: {
          bookingId: booking.id,
          amount: pricing.totalPrice,
          currency: "usd",
          status: "pending",
          stripeSessionId: checkoutSession.id,
        },
      })
    }

    return NextResponse.json({
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id,
    })
  } catch (error) {
    console.error("POST /api/checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
