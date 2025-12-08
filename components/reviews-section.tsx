"use client"

import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ReviewsSectionProps {
  rating: number
  reviewCount: number
}

const reviews = [
  {
    id: 1,
    author: "Michael Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    date: "December 2024",
    rating: 5,
    content:
      "Absolutely stunning loft with incredible city views! Sarah was an amazing host - super responsive and provided great local recommendations. The space was exactly as described and perfect for our business trip.",
  },
  {
    id: 2,
    author: "Emma Thompson",
    avatar: "/placeholder.svg?height=40&width=40",
    date: "November 2024",
    rating: 5,
    content:
      "This place exceeded our expectations. The location is unbeatable - walking distance to everything we wanted to see. The apartment is modern, clean, and has all the amenities you could need.",
  },
  {
    id: 3,
    author: "David Kim",
    avatar: "/placeholder.svg?height=40&width=40",
    date: "November 2024",
    rating: 4,
    content:
      "Great stay overall! The workspace setup was perfect for remote work, and the WiFi was fast and reliable. Only minor issue was some street noise at night, but the blackout curtains helped.",
  },
]

const ratingBreakdown = [
  { stars: 5, percentage: 78 },
  { stars: 4, percentage: 15 },
  { stars: 3, percentage: 5 },
  { stars: 2, percentage: 1 },
  { stars: 1, percentage: 1 },
]

export function ReviewsSection({ rating, reviewCount }: ReviewsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
        <h2 className="text-2xl font-bold">
          {rating} · {reviewCount} reviews
        </h2>
      </div>

      {/* Rating Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          {ratingBreakdown.map((item) => (
            <div key={item.stars} className="flex items-center gap-3">
              <span className="text-sm w-6">{item.stars}</span>
              <Progress value={item.percentage} className="flex-1" />
              <span className="text-sm text-muted-foreground w-8">{item.percentage}%</span>
            </div>
          ))}
        </div>

        {/* AI Review Insights */}
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">AI Review Insights</h3>
            <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
              <div>• Most praised: Location & cleanliness</div>
              <div>• Common mentions: Great host, city views</div>
              <div>• Recent trend: Excellent for business travel</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Reviews */}
      <div className="grid gap-6 md:grid-cols-2">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.author} />
                  <AvatarFallback>
                    {review.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{review.author}</span>
                    <div className="flex">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{review.date}</p>
                  <p className="text-sm">{review.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" className="w-full md:w-auto bg-transparent">
        Show all {reviewCount} reviews
      </Button>
    </div>
  )
}
