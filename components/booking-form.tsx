"use client"

/*
  BOOKING FORM
  Philosophy: Clean, functional, no visual noise

  - No gradient buttons
  - No decorative badges
  - Restrained styling
  - Clear information hierarchy
*/

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, Minus, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface BookingFormProps {
  listingId: string
  price: number
  maxGuests: number
  isAuthenticated: boolean
}

export function BookingForm({
  listingId,
  price,
  maxGuests,
  isAuthenticated,
}: BookingFormProps) {
  const router = useRouter()
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Calculate pricing
  const nights =
    checkIn && checkOut
      ? Math.ceil(
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0

  const subtotal = price * nights
  const total = subtotal // No service fee

  // Minimum check-in date is today
  const today = new Date().toISOString().split("T")[0]

  // Reset checkout if check-in changes
  useEffect(() => {
    if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
      setCheckOut("")
    }
  }, [checkIn, checkOut])

  const handleReserve = async () => {
    setError("")

    if (!isAuthenticated) {
      router.push(`/login?redirect=/listings/${listingId}`)
      return
    }

    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates")
      return
    }

    if (nights < 1) {
      setError("Minimum stay is 1 night")
      return
    }

    setLoading(true)

    try {
      // Create booking
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          checkIn,
          checkOut,
          guests,
        }),
      })

      const bookingData = await bookingRes.json()

      if (!bookingRes.ok) {
        throw new Error(bookingData.error || "Failed to create booking")
      }

      // Check if payments are enabled (production) or demo mode
      const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true"

      if (DEMO_MODE) {
        // Demo mode: Skip payment and confirm booking directly
        const confirmRes = await fetch(`/api/bookings/${bookingData.booking.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "confirmed" }),
        })

        if (!confirmRes.ok) {
          console.warn("Could not auto-confirm booking")
        }

        // Redirect to success page
        router.push(`/booking/success?booking_id=${bookingData.booking.id}&demo=true`)
      } else {
        // Production: Redirect to Stripe checkout
        const checkoutRes = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: bookingData.booking.id }),
        })

        const checkoutData = await checkoutRes.json()

        if (!checkoutRes.ok) {
          throw new Error(checkoutData.error || "Failed to create checkout session")
        }

        // Redirect to Stripe Checkout
        if (checkoutData.checkoutUrl) {
          window.location.href = checkoutData.checkoutUrl
        } else {
          throw new Error("No checkout URL received")
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="border border-border rounded-md p-6 bg-card space-y-5">
      {/* Price Header */}
      <div>
        <span className="text-xl font-medium text-foreground">${price}</span>
        <span className="text-muted-foreground">/night</span>
      </div>

      {/* Date Selection */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="checkin" className="text-xs text-muted-foreground mb-1.5 block">
            Check-in
          </Label>
          <Input
            id="checkin"
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => setCheckIn(e.target.value)}
            className="bg-background"
          />
        </div>
        <div>
          <Label htmlFor="checkout" className="text-xs text-muted-foreground mb-1.5 block">
            Check-out
          </Label>
          <Input
            id="checkout"
            type="date"
            value={checkOut}
            min={checkIn || today}
            onChange={(e) => setCheckOut(e.target.value)}
            className="bg-background"
          />
        </div>
      </div>

      {/* Guest Selection */}
      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block">Guests</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between bg-background"
            >
              <span className="text-foreground">
                {guests} {guests === 1 ? "guest" : "guests"}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Guests</p>
                <p className="text-xs text-muted-foreground">Max {maxGuests}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  disabled={guests <= 1}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center text-sm">{guests}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGuests(Math.min(maxGuests, guests + 1))}
                  disabled={guests >= maxGuests}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}

      {/* Reserve Button */}
      <Button
        onClick={handleReserve}
        disabled={loading}
        className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : !isAuthenticated ? (
          "Sign in to reserve"
        ) : (
          "Reserve"
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        You won&apos;t be charged yet
      </p>

      {/* Price Breakdown */}
      {nights > 0 && (
        <div className="space-y-3 pt-3 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              ${price} × {nights} {nights === 1 ? "night" : "nights"}
            </span>
            <span className="text-foreground">${subtotal.toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span className="text-foreground">Total</span>
            <span className="text-foreground">${total.toFixed(0)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
