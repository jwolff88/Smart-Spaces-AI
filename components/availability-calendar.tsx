"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Calendar, Lock, Unlock } from "lucide-react"

interface BlockedDate {
  id: string
  date: string
  reason: string | null
}

interface BookingDate {
  id: string
  checkIn: string
  checkOut: string
  status: string
  guestName: string | null
}

interface AvailabilityCalendarProps {
  listingId: string
  listingTitle: string
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export function AvailabilityCalendar({ listingId, listingTitle }: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [bookings, setBookings] = useState<BookingDate[]>([])
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [blockReason, setBlockReason] = useState("personal")

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const fetchCalendar = async () => {
    try {
      const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`
      const res = await fetch(`/api/calendar?listingId=${listingId}&month=${monthStr}`)
      const data = await res.json()
      if (data.blockedDates) setBlockedDates(data.blockedDates)
      if (data.bookings) setBookings(data.bookings)
    } catch (error) {
      console.error("Failed to fetch calendar:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchCalendar()
  }, [listingId, year, month])

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDates(new Set())
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDates(new Set())
  }

  const getDaysInMonth = () => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days: (number | null)[] = []

    // Empty cells for days before the first of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  const getDateString = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const isBlocked = (day: number) => {
    const dateStr = getDateString(day)
    return blockedDates.some((bd) => bd.date === dateStr)
  }

  const isBooked = (day: number) => {
    const dateStr = getDateString(day)
    const date = new Date(dateStr)
    return bookings.some((b) => {
      const checkIn = new Date(b.checkIn)
      const checkOut = new Date(b.checkOut)
      return date >= checkIn && date < checkOut
    })
  }

  const getBookingForDay = (day: number) => {
    const dateStr = getDateString(day)
    const date = new Date(dateStr)
    return bookings.find((b) => {
      const checkIn = new Date(b.checkIn)
      const checkOut = new Date(b.checkOut)
      return date >= checkIn && date < checkOut
    })
  }

  const isPast = (day: number) => {
    const date = new Date(year, month, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const toggleDateSelection = (day: number) => {
    if (isPast(day) || isBooked(day)) return

    const dateStr = getDateString(day)
    const newSelected = new Set(selectedDates)
    if (newSelected.has(dateStr)) {
      newSelected.delete(dateStr)
    } else {
      newSelected.add(dateStr)
    }
    setSelectedDates(newSelected)
  }

  const handleBlockDates = async () => {
    if (selectedDates.size === 0) return

    setSaving(true)
    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          dates: Array.from(selectedDates),
          reason: blockReason,
          action: "block",
        }),
      })

      if (res.ok) {
        setSelectedDates(new Set())
        fetchCalendar()
      }
    } catch (error) {
      console.error("Failed to block dates:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleUnblockDates = async () => {
    if (selectedDates.size === 0) return

    setSaving(true)
    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          dates: Array.from(selectedDates),
          action: "unblock",
        }),
      })

      if (res.ok) {
        setSelectedDates(new Set())
        fetchCalendar()
      }
    } catch (error) {
      console.error("Failed to unblock dates:", error)
    } finally {
      setSaving(false)
    }
  }

  const days = getDaysInMonth()

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {listingTitle}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevMonth}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-white font-medium min-w-[140px] text-center">
              {MONTHS[month]} {year}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={nextMonth}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-slate-400 text-center py-8">Loading calendar...</p>
        ) : (
          <>
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-slate-400 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="h-12" />
                }

                const dateStr = getDateString(day)
                const blocked = isBlocked(day)
                const booked = isBooked(day)
                const past = isPast(day)
                const selected = selectedDates.has(dateStr)
                const booking = getBookingForDay(day)

                let bgClass = "bg-slate-700 hover:bg-slate-600"
                let textClass = "text-white"

                if (past) {
                  bgClass = "bg-slate-800"
                  textClass = "text-slate-500"
                } else if (booked) {
                  bgClass = "bg-blue-600"
                  textClass = "text-white"
                } else if (blocked) {
                  bgClass = "bg-red-600/50"
                  textClass = "text-red-200"
                } else if (selected) {
                  bgClass = "bg-yellow-500"
                  textClass = "text-black"
                }

                return (
                  <button
                    key={day}
                    onClick={() => toggleDateSelection(day)}
                    disabled={past || booked}
                    className={`h-12 rounded-lg flex flex-col items-center justify-center transition-colors ${bgClass} ${textClass} ${
                      past || booked ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                    title={
                      booking
                        ? `Booked: ${booking.guestName || "Guest"}`
                        : blocked
                        ? "Blocked"
                        : ""
                    }
                  >
                    <span className="text-sm font-medium">{day}</span>
                    {blocked && !booked && (
                      <Lock className="h-3 w-3 opacity-75" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-slate-700" />
                <span className="text-slate-400">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-600" />
                <span className="text-slate-400">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-600/50" />
                <span className="text-slate-400">Blocked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-500" />
                <span className="text-slate-400">Selected</span>
              </div>
            </div>

            {/* Actions */}
            {selectedDates.size > 0 && (
              <div className="mt-4 p-4 bg-slate-900 rounded-lg space-y-3">
                <p className="text-sm text-slate-300">
                  {selectedDates.size} date{selectedDates.size > 1 ? "s" : ""} selected
                </p>
                <div className="flex flex-wrap gap-3">
                  <Select value={blockReason} onValueChange={setBlockReason}>
                    <SelectTrigger className="w-[180px] bg-slate-800 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="personal">Personal Use</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="seasonal">Seasonal Closure</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleBlockDates}
                    disabled={saving}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Block Dates
                  </Button>
                  <Button
                    onClick={handleUnblockDates}
                    disabled={saving}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Unlock className="h-4 w-4 mr-2" />
                    Unblock Dates
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
