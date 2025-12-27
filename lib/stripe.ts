import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Warning: STRIPE_SECRET_KEY not set. Payment features disabled.")
}

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-12-15.clover",
      typescript: true,
    })
  : null

// Platform takes 10% from hosts (not charged to guests)
export const PLATFORM_FEE_PERCENT = 10

export function calculatePricing(pricePerNight: number, nights: number) {
  const subtotal = pricePerNight * nights
  const serviceFee = 0 // No service fee charged to travelers - we take from hosts
  const totalPrice = subtotal

  // Calculate platform fee (taken from host's share)
  const platformFee = Math.round(subtotal * (PLATFORM_FEE_PERCENT / 100) * 100) / 100
  const hostPayout = subtotal - platformFee

  return {
    nights,
    pricePerNight,
    subtotal,
    serviceFee,
    totalPrice,
    platformFee, // Amount we keep
    hostPayout,  // Amount host receives
    // Stripe expects amounts in cents
    totalPriceCents: Math.round(totalPrice * 100),
    platformFeeCents: Math.round(platformFee * 100),
  }
}
