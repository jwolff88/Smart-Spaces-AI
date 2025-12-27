import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"

// GET /api/stripe/connect - Get host's Stripe Connect status
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        stripeAccountId: true,
        stripeAccountStatus: true,
        stripeOnboardingComplete: true,
        createdAt: true, // For trial calculation
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Calculate trial period info
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    const isInTrialPeriod = user.createdAt > threeMonthsAgo

    // Calculate days remaining in trial
    const trialEndDate = new Date(user.createdAt)
    trialEndDate.setMonth(trialEndDate.getMonth() + 3)
    const daysRemaining = isInTrialPeriod
      ? Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : 0

    // If they have a Stripe account, check its current status
    if (user.stripeAccountId && stripe) {
      try {
        const account = await stripe.accounts.retrieve(user.stripeAccountId)

        // Update status based on Stripe's response
        const isComplete = account.details_submitted && account.payouts_enabled
        const status = account.payouts_enabled ? "active" :
                       account.details_submitted ? "pending" : "incomplete"

        // Update in database if changed
        if (status !== user.stripeAccountStatus || isComplete !== user.stripeOnboardingComplete) {
          await db.user.update({
            where: { id: session.user.id },
            data: {
              stripeAccountStatus: status,
              stripeOnboardingComplete: isComplete,
            },
          })
        }

        return NextResponse.json({
          hasAccount: true,
          accountId: user.stripeAccountId,
          status,
          isComplete,
          payoutsEnabled: account.payouts_enabled,
          detailsSubmitted: account.details_submitted,
          trial: {
            isActive: isInTrialPeriod,
            daysRemaining,
            endsAt: trialEndDate.toISOString(),
          },
        })
      } catch (error) {
        console.error("Error fetching Stripe account:", error)
      }
    }

    return NextResponse.json({
      hasAccount: false,
      accountId: null,
      status: null,
      isComplete: false,
      trial: {
        isActive: isInTrialPeriod,
        daysRemaining,
        endsAt: trialEndDate.toISOString(),
      },
    })
  } catch (error) {
    console.error("GET /api/stripe/connect error:", error)
    return NextResponse.json({ error: "Failed to get connect status" }, { status: 500 })
  }
}

// POST /api/stripe/connect - Create Stripe Connect account and onboarding link
export async function POST() {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 503 }
      )
    }

    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        stripeAccountId: true,
        role: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Only hosts can connect
    if (user.role !== "host") {
      return NextResponse.json(
        { error: "Only hosts can connect a payout account" },
        { status: 403 }
      )
    }

    let accountId = user.stripeAccountId

    // Create Stripe Connect account if doesn't exist
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express", // Express accounts are easier to set up
        email: user.email || undefined,
        metadata: {
          userId: user.id,
        },
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: "individual",
        business_profile: {
          mcc: "6513", // Real estate agents and managers
          product_description: "Vacation rental property host",
        },
      })

      accountId = account.id

      // Save to database
      await db.user.update({
        where: { id: user.id },
        data: {
          stripeAccountId: accountId,
          stripeAccountStatus: "pending",
          stripeOnboardingComplete: false,
        },
      })
    }

    // Create onboarding link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${baseUrl}/host-dashboard?connect=refresh`,
      return_url: `${baseUrl}/host-dashboard?connect=success`,
      type: "account_onboarding",
    })

    return NextResponse.json({
      url: accountLink.url,
      accountId,
    })
  } catch (error) {
    console.error("POST /api/stripe/connect error:", error)
    return NextResponse.json(
      { error: "Failed to create connect account" },
      { status: 500 }
    )
  }
}

// DELETE /api/stripe/connect - Disconnect Stripe account (for testing)
export async function DELETE() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await db.user.update({
      where: { id: session.user.id },
      data: {
        stripeAccountId: null,
        stripeAccountStatus: null,
        stripeOnboardingComplete: false,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/stripe/connect error:", error)
    return NextResponse.json({ error: "Failed to disconnect" }, { status: 500 })
  }
}
