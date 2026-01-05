"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, ArrowLeft } from "lucide-react"

interface Message {
  id: string
  content: string
  createdAt: string
  sender: {
    id: string
    name: string | null
    image: string | null
  }
}

interface ChatWindowProps {
  conversationId: string
  currentUserId: string
  onBack?: () => void
}

export function ChatWindow({ conversationId, currentUserId, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages?conversationId=${conversationId}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setMessages(data)
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return

    setSending(true)
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          content: newMessage.trim(),
        }),
      })

      if (res.ok) {
        setNewMessage("")
        fetchMessages()
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (loading) {
    return (
      <Card className="glass-neon border-primary/30 h-full flex flex-col">
        <CardContent className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading messages...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-neon border-primary/30 h-full flex flex-col">
      <CardHeader className="border-b border-border/50 py-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <CardTitle className="text-foreground text-lg text-glow-cyan">Conversation</CardTitle>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.sender.id === currentUserId
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    isOwn
                      ? "bg-primary/30 text-foreground border border-primary/50"
                      : "bg-secondary/20 text-foreground border border-secondary/30"
                  }`}
                >
                  {!isOwn && (
                    <p className="text-xs text-secondary mb-1">
                      {msg.sender.name || "User"}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwn ? "text-primary/70" : "text-muted-foreground"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Input Area */}
      <div className="border-t border-border/50 p-4">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground min-h-[44px] max-h-[120px] resize-none focus:border-primary focus:glow-cyan transition-all"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            className="bg-primary hover:bg-primary/80 text-primary-foreground px-4 glow-cyan hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
