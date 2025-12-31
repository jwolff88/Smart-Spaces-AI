"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, Send, Star, Check, User } from "lucide-react"

interface FeedbackItem {
  id: string
  name: string | null
  message: string
  rating: number | null
  type: string
  createdAt: string
}

export function FeedbackBox() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    type: "general",
  })

  // Fetch existing feedback on mount
  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    try {
      const response = await fetch("/api/feedback")
      if (response.ok) {
        const data = await response.json()
        setFeedbackList(data)
      }
    } catch (error) {
      console.error("Failed to fetch feedback:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.message.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          rating: rating || null,
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        // Refresh the feedback list
        await fetchFeedback()
        setTimeout(() => {
          setIsFormOpen(false)
          setIsSubmitted(false)
          setFormData({ name: "", email: "", message: "", type: "general" })
          setRating(0)
        }, 2000)
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "feature": return "Feature Request"
      case "bug": return "Bug Report"
      case "other": return "Other"
      default: return "Feedback"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "feature": return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "bug": return "bg-red-500/20 text-red-400 border-red-500/30"
      default: return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">What People Are Saying</h2>
        <p className="text-slate-400">Real feedback from our demo users</p>
      </div>

      {/* Feedback Display Grid */}
      {feedbackList.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {feedbackList.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-slate-900/50 border border-white/10 rounded-xl hover:border-blue-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-slate-700 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {item.name || "Anonymous"}
                    </p>
                    <p className="text-slate-500 text-xs">{formatDate(item.createdAt)}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${getTypeColor(item.type)}`}>
                  {getTypeLabel(item.type)}
                </span>
              </div>

              {item.rating && (
                <div className="flex gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= item.rating! ? "text-yellow-400 fill-yellow-400" : "text-slate-600"
                      }`}
                    />
                  ))}
                </div>
              )}

              <p className="text-slate-300 text-sm leading-relaxed">{item.message}</p>
            </div>
          ))}
        </div>
      )}

      {feedbackList.length === 0 && (
        <div className="text-center py-8 mb-8">
          <p className="text-slate-500">No feedback yet. Be the first to share your thoughts!</p>
        </div>
      )}

      {/* Feedback Form */}
      {!isFormOpen ? (
        <div className="flex justify-center">
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-6 py-3 bg-slate-900/50 border border-white/10 rounded-xl hover:border-blue-500/50 transition-all flex items-center gap-3 group"
          >
            <MessageSquare className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-slate-300 group-hover:text-white transition-colors">
              Share Your Feedback
            </span>
          </button>
        </div>
      ) : isSubmitted ? (
        <div className="max-w-2xl mx-auto p-6 bg-slate-900/50 border border-green-500/50 rounded-2xl">
          <div className="flex items-center justify-center gap-3 text-green-400">
            <Check className="h-6 w-6" />
            <span className="text-lg font-medium">Thank you for your feedback!</span>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto p-6 bg-slate-900/50 border border-blue-500/30 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-400" />
              Share Your Feedback
            </h3>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Name (optional)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Email (optional)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Feedback Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="general">General Feedback</option>
                <option value="feature">Feature Request</option>
                <option value="bug">Bug Report</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Rating (optional)</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= (hoveredRating || rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-slate-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Your Feedback *</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none resize-none"
                rows={4}
                placeholder="Tell us what you think about Smart Spaces..."
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !formData.message.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}
