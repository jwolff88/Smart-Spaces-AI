"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, Send, Star, Check } from "lucide-react"

export function FeedbackBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    type: "general",
  })

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
        setTimeout(() => {
          setIsOpen(false)
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

  if (!isOpen) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full p-4 bg-slate-900/50 border border-white/10 rounded-2xl hover:border-blue-500/50 transition-all flex items-center justify-center gap-3 group"
        >
          <MessageSquare className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="text-slate-300 group-hover:text-white transition-colors">
            We&apos;d love your feedback on this demo!
          </span>
        </button>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-slate-900/50 border border-green-500/50 rounded-2xl">
        <div className="flex items-center justify-center gap-3 text-green-400">
          <Check className="h-6 w-6" />
          <span className="text-lg font-medium">Thank you for your feedback!</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-slate-900/50 border border-blue-500/30 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-400" />
          Share Your Feedback
        </h3>
        <button
          onClick={() => setIsOpen(false)}
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
  )
}
