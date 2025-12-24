import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import Stripe from "stripe"

// Stripe webhook handler
export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    )
  }

  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.payment_status === "paid") {
          const bookingId = session.metadata?.bookingId || session.client_reference_id

          if (!bookingId) {
            console.error("No bookingId in session metadata")
            break
          }

          // Update payment record
          await db.payment.updateMany({
            where: { stripeSessionId: session.id },
            data: {
              status: "succeeded",
              stripePaymentId: session.payment_intent as string,
            },
          })

          // Update booking status to confirmed
          await db.booking.update({
            where: { id: bookingId },
            data: { status: "confirmed" },
          })

          console.log(`Payment succeeded for booking ${bookingId}`)
        }
        break
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session
        const bookingId = session.metadata?.bookingId

        if (bookingId) {
          // Mark payment as failed
          await db.payment.updateMany({
            where: { stripeSessionId: session.id },
            data: { status: "failed" },
          })

          console.log(`Checkout expired for booking ${bookingId}`)
        }
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Update payment record
        await db.payment.updateMany({
          where: { stripePaymentId: paymentIntent.id },
          data: { status: "failed" },
        })

        console.log(`Payment failed: ${paymentIntent.id}`)
        break
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge
        const paymentIntentId = charge.payment_intent as string

        if (paymentIntentId) {
          // Update payment record
          const payment = await db.payment.findFirst({
            where: { stripePaymentId: paymentIntentId },
          })

          if (payment) {
            await db.payment.update({
              where: { id: payment.id },
              data: { status: "refunded" },
            })

            // Update booking status
            await db.booking.update({
              where: { id: payment.bookingId },
              data: { status: "cancelled" },
            })

            console.log(`Refund processed for payment ${payment.id}`)
          }
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}
