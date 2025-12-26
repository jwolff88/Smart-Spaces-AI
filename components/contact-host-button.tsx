"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send } from "lucide-react"

interface ContactHostButtonProps {
  hostId: string
  hostName: string
  listingId: string
  listingTitle: string
  isAuthenticated: boolean
  variant?: "default" | "mobile"
}

export function ContactHostButton({
  hostId,
  hostName,
  listingId,
  listingTitle,
  isAuthenticated,
  variant = "default",
}: ContactHostButtonProps) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSend = async () => {
    if (!message.trim()) return

    setSending(true)
    setError("")

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: hostId,
          listingId,
          content: `[Regarding: ${listingTitle}]\n\n${message.trim()}`,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message")
      }

      setOpen(false)
      setMessage("")
      router.push(`/messages`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  const isMobile = variant === "mobile"

  if (!isAuthenticated) {
    return (
      <Button
        variant="outline"
        size={isMobile ? "icon" : "default"}
        className={isMobile ? "h-10 w-10" : "w-full border-slate-600 text-slate-300 hover:bg-slate-700"}
        onClick={() => router.push("/login")}
      >
        <MessageSquare className="h-4 w-4" />
        {!isMobile && <span className="ml-2">Sign in to contact host</span>}
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size={isMobile ? "icon" : "default"}
          className={isMobile ? "h-10 w-10" : "w-full border-slate-600 text-slate-300 hover:bg-slate-700"}
        >
          <MessageSquare className="h-4 w-4" />
          {!isMobile && <span className="ml-2">Contact {hostName || "Host"}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">
            Message {hostName || "Host"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <p className="text-sm text-slate-400">
            Ask about: <span className="text-white">{listingTitle}</span>
          </p>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hi! I'm interested in your listing..."
            className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 min-h-[120px]"
          />

          <div className="flex gap-3">
            <Button
              onClick={handleSend}
              disabled={!message.trim() || sending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              {sending ? "Sending..." : "Send Message"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
