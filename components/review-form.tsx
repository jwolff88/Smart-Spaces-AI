"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"

interface ReviewFormProps {
  bookingId: string
  listingTitle: string
  onSuccess?: () => void
  onCancel?: () => void
}

function StarRating({
  value,
  onChange,
  label,
}: {
  value: number
  onChange: (value: number) => void
  label: string
}) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-300">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="focus:outline-none"
          >
            <Star
              className={`h-5 w-5 transition-colors ${
                star <= (hover || value)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-slate-600"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export function ReviewForm({
  bookingId,
  listingTitle,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [cleanliness, setCleanliness] = useState(0)
  const [accuracy, setAccuracy] = useState(0)
  const [checkIn, setCheckIn] = useState(0)
  const [communication, setCommunication] = useState(0)
  const [location, setLocation] = useState(0)
  const [value, setValue] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      setError("Please provide an overall rating")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          rating,
          comment: comment.trim() || null,
          cleanliness: cleanliness || null,
          accuracy: accuracy || null,
          checkIn: checkIn || null,
          communication: communication || null,
          location: location || null,
          value: value || null,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review")
      }

      onSuccess?.()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Review: {listingTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Overall Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">
              Overall Rating *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-600 hover:text-slate-400"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Ratings */}
          <div className="space-y-3 p-4 bg-slate-900 rounded-lg">
            <p className="text-sm font-medium text-white mb-3">
              Rate specific aspects (optional)
            </p>
            <StarRating
              value={cleanliness}
              onChange={setCleanliness}
              label="Cleanliness"
            />
            <StarRating
              value={accuracy}
              onChange={setAccuracy}
              label="Accuracy"
            />
            <StarRating
              value={checkIn}
              onChange={setCheckIn}
              label="Check-in"
            />
            <StarRating
              value={communication}
              onChange={setCommunication}
              label="Communication"
            />
            <StarRating
              value={location}
              onChange={setLocation}
              label="Location"
            />
            <StarRating value={value} onChange={setValue} label="Value" />
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">
              Your Review (optional)
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience..."
              className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 min-h-[100px]"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading || rating === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
            {onCancel && (
              <Button
                type="button"
                onClick={onCancel}
                className="bg-slate-700 hover:bg-slate-600 text-white"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
