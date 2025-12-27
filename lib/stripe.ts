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

export const PLATFORM_FEE_PERCENT = 0 // No fee for now - free to use

export function calculatePricing(pricePerNight: number, nights: number) {
  const subtotal = pricePerNight * nights
  const serviceFee = 0 // No service fee charged to travelers
  const totalPrice = subtotal

  return {
    nights,
    pricePerNight,
    subtotal,
    serviceFee,
    totalPrice,
    // Stripe expects amounts in cents
    totalPriceCents: Math.round(totalPrice * 100),
  }
}
