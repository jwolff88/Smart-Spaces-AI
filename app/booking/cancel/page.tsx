"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function BookingCancelContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("booking_id")

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">
            Payment Cancelled
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Your payment was not completed. Your reservation is still pending.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            No charges have been made to your card. You can try again or choose
            a different property.
          </p>

          <div className="flex flex-col gap-2 pt-4">
            {bookingId && (
              <Link href={`/listings/${bookingId}`}>
                <Button className="w-full">Try Again</Button>
              </Link>
            )}
            <Link href="/search">
              <Button variant="outline" className="w-full">
                Browse Properties
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full">
                Return Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function BookingCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <BookingCancelContent />
    </Suspense>
  )
}
