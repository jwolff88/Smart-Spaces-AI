"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Calendar, MapPin, Home, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BookingDetails {
  id: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: string
  listing: {
    title: string
    location: string
  }
}

function BookingSuccessContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("booking_id")
  const isDemo = searchParams.get("demo") === "true"
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (bookingId) {
      fetch(`/api/bookings/${bookingId}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setBooking(data)
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [bookingId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            Booking Confirmed!
          </CardTitle>
          {isDemo && (
            <div className="inline-block bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded mt-2">
              Demo Mode - No payment required
            </div>
          )}
          <p className="text-muted-foreground mt-2">
            Your reservation has been successfully {isDemo ? "created" : "processed"}.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="text-center py-4 text-muted-foreground">
              Loading booking details...
            </div>
          ) : booking ? (
            <div className="space-y-4 border rounded-lg p-4 bg-white">
              <div className="flex items-start gap-3">
                <Home className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{booking.listing.title}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {booking.listing.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">
                    {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="font-medium">{isDemo ? "Total" : "Total Paid"}</span>
                  <span className="font-bold text-lg">
                    ${booking.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Thank you for your booking!
            </p>
          )}

          <div className="flex flex-col gap-2 pt-4">
            <Link href="/guest-dashboard">
              <Button className="w-full">View My Bookings</Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" className="w-full">
                Browse More Properties
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <BookingSuccessContent />
    </Suspense>
  )
}
