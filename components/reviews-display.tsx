"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

interface Review {
  id: string
  rating: number
  comment: string | null
  cleanliness: number | null
  accuracy: number | null
  checkIn: number | null
  communication: number | null
  location: number | null
  value: number | null
  createdAt: string
  guest: {
    name: string | null
    image: string | null
  }
}

interface ReviewStats {
  count: number
  average: number
  cleanliness: number
  accuracy: number
  checkIn: number
  communication: number
  location: number
  value: number
}

interface ReviewsDisplayProps {
  listingId: string
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-slate-600"
          }`}
        />
      ))}
    </div>
  )
}

function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-slate-300 w-28">{label}</span>
      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
      <span className="text-white w-8 text-right">{value.toFixed(1)}</span>
    </div>
  )
}

export function ReviewsDisplay({ listingId }: ReviewsDisplayProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`/api/reviews?listingId=${listingId}`)
        const data = await res.json()
        if (data.reviews) {
          setReviews(data.reviews)
          setStats(data.stats)
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [listingId])

  if (loading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="py-8">
          <p className="text-slate-400 text-center">Loading reviews...</p>
        </CardContent>
      </Card>
    )
  }

  if (reviews.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="py-8">
          <p className="text-slate-400 text-center">No reviews yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Rating Card */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            {stats?.average.toFixed(1)} · {stats?.count} review
            {stats?.count !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <RatingBar label="Cleanliness" value={stats?.cleanliness || 0} />
              <RatingBar label="Accuracy" value={stats?.accuracy || 0} />
              <RatingBar label="Check-in" value={stats?.checkIn || 0} />
            </div>
            <div className="space-y-2">
              <RatingBar
                label="Communication"
                value={stats?.communication || 0}
              />
              <RatingBar label="Location" value={stats?.location || 0} />
              <RatingBar label="Value" value={stats?.value || 0} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-medium">
                  {review.guest.name?.[0]?.toUpperCase() || "G"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-white">
                        {review.guest.name || "Guest"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <StarDisplay rating={review.rating} />
                  </div>
                  {review.comment && (
                    <p className="text-slate-300">{review.comment}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Compact version for listing cards
export function ReviewsSummary({
  listingId,
}: {
  listingId: string
}) {
  const [stats, setStats] = useState<ReviewStats | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`/api/reviews?listingId=${listingId}`)
        const data = await res.json()
        if (data.stats) {
          setStats(data.stats)
        }
      } catch (error) {
        console.error("Failed to fetch review stats:", error)
      }
    }

    fetchStats()
  }, [listingId])

  if (!stats || stats.count === 0) return null

  return (
    <div className="flex items-center gap-1 text-sm">
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span className="font-medium">{stats.average.toFixed(1)}</span>
      <span className="text-slate-400">({stats.count})</span>
    </div>
  )
}
