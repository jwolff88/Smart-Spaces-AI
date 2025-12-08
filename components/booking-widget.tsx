"use client"

import { useState } from "react"
import { ChevronDown, Minus, Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

interface BookingWidgetProps {
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
}

export function BookingWidget({ price, originalPrice, rating, reviewCount }: BookingWidgetProps) {
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(2)
  const [nights, setNights] = useState(3)

  const subtotal = price * nights
  const cleaningFee = 45
  const serviceFee = Math.round(subtotal * 0.14)
  const total = subtotal + cleaningFee + serviceFee

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">${price}</span>
            {originalPrice && <span className="text-lg text-muted-foreground line-through">${originalPrice}</span>}
            <span className="text-sm text-muted-foreground">night</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-sm text-muted-foreground">({reviewCount})</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date Selection */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="checkin" className="text-xs font-medium">
              CHECK-IN
            </Label>
            <Input
              id="checkin"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="checkout" className="text-xs font-medium">
              CHECK-OUT
            </Label>
            <Input
              id="checkout"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {/* Guest Selection */}
        <div>
          <Label className="text-xs font-medium">GUESTS</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between mt-1 bg-transparent">
                <span>
                  {guests} guest{guests !== 1 ? "s" : ""}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Adults</div>
                    <div className="text-sm text-muted-foreground">Ages 13 or above</div>
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
                      onClick={() => setGuests(Math.min(8, guests + 1))}
                      disabled={guests >= 8}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Reserve Button */}
        <Button className="w-full" size="lg">
          Reserve
        </Button>

        <p className="text-center text-sm text-muted-foreground">You won't be charged yet</p>

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="underline">
              ${price} x {nights} nights
            </span>
            <span>${subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="underline">Cleaning fee</span>
            <span>${cleaningFee}</span>
          </div>
          <div className="flex justify-between">
            <span className="underline">Smart Spaces service fee</span>
            <span>${serviceFee}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total before taxes</span>
            <span>${total}</span>
          </div>
        </div>

        {/* AI Pricing Notice */}
        <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
          <div className="flex items-center gap-2 text-sm">
            <div className="text-blue-600">🤖</div>
            <span className="text-blue-800 dark:text-blue-200">
              AI-optimized pricing saves you ${originalPrice ? originalPrice - price : 35} per night
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
