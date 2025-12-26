"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { X } from "lucide-react"

interface CancelBookingButtonProps {
  bookingId: string
  listingTitle: string
}

export function CancelBookingButton({ bookingId, listingTitle }: CancelBookingButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  const handleCancel = async () => {
    setIsCancelling(true)
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      })

      if (res.ok) {
        router.refresh()
        setIsOpen(false)
      } else {
        const data = await res.json()
        alert(data.error || "Failed to cancel booking")
      }
    } catch (error) {
      console.error("Failed to cancel booking", error)
      alert("Failed to cancel booking")
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel your booking at <strong>{listingTitle}</strong>?
            <br /><br />
            <span className="text-sm text-muted-foreground">
              Note: Cancellation fees may apply depending on how close to check-in you cancel.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isCancelling}>Keep Booking</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={isCancelling}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isCancelling ? "Cancelling..." : "Cancel Booking"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
