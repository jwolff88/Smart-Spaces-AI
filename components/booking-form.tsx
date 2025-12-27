"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, Minus, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-lg border-gray-200">
      <CardContent className="p-6 space-y-5">
        {/* Price Header */}
        <div className="flex justify-between items-end">
          <div>
            <span className="text-2xl font-bold">${price}</span>
            <span className="text-gray-500"> / night</span>
          </div>
          <div className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
            Smart Price Active
          </div>
        </div>

        {/* Date Selection */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="checkin" className="text-xs font-medium uppercase">
              Check-in
            </Label>
            <Input
              id="checkin"
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => setCheckIn(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="checkout" className="text-xs font-medium uppercase">
              Check-out
            </Label>
            <Input
              id="checkout"
              type="date"
              value={checkOut}
              min={checkIn || today}
              onChange={(e) => setCheckOut(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {/* Guest Selection */}
        <div>
          <Label className="text-xs font-medium uppercase">Guests</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between mt-1 bg-transparent"
              >
                <span>
                  {guests} guest{guests !== 1 ? "s" : ""}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Guests</div>
                  <div className="text-sm text-muted-foreground">
                    Max {maxGuests}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    disabled={guests <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{guests}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGuests(Math.min(maxGuests, guests + 1))}
                    disabled={guests >= maxGuests}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Reserve Button */}
        <Button
          onClick={handleReserve}
          disabled={loading}
          className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-indigo-600"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : !isAuthenticated ? (
            "Sign in to Reserve"
          ) : (
            "Reserve"
          )}
        </Button>

        <p className="text-center text-xs text-gray-400">
          You won&apos;t be charged yet
        </p>

        {/* Price Breakdown */}
        {nights > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span className="underline">
                ${price} x {nights} night{nights > 1 ? "s" : ""}
              </span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
