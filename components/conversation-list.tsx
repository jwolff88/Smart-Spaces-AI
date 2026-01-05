"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare } from "lucide-react"

interface Conversation {
  id: string
  otherUser: {
    id: string
    name: string | null
    image: string | null
    role: string
  } | null
  lastMessage: {
    content: string
    senderId: string
    senderName: string | null
    createdAt: string
  } | null
  unreadCount: number
  updatedAt: string
}

interface ConversationListProps {
  onSelect: (conversationId: string) => void
  selectedId?: string
}

export function ConversationList({ onSelect, selectedId }: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/messages")
      const data = await res.json()
      if (Array.isArray(data)) {
        setConversations(data)
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConversations()
    // Poll for new messages every 10 seconds
    const interval = setInterval(fetchConversations, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card className="glass-neon border-primary/30">
        <CardContent className="py-8">
          <p className="text-muted-foreground text-center">Loading conversations...</p>
        </CardContent>
      </Card>
    )
  }

  if (conversations.length === 0) {
    return (
      <Card className="glass-neon border-primary/30">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2 text-glow-cyan">
            <MessageSquare className="h-5 w-5 text-primary" />
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">No conversations yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-neon border-primary/30">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2 text-glow-cyan">
          <MessageSquare className="h-5 w-5 text-primary" />
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={`w-full p-4 text-left hover:bg-primary/10 transition-colors ${
                selectedId === conv.id ? "bg-primary/20 border-l-2 border-l-primary" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-secondary/30 flex items-center justify-center text-secondary font-medium flex-shrink-0 border border-secondary/50">
                  {conv.otherUser?.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-foreground truncate">
                      {conv.otherUser?.name || "Unknown User"}
                    </p>
                    {conv.unreadCount > 0 && (
                      <Badge className="bg-primary text-primary-foreground text-xs glow-cyan">
                        {conv.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-xs border-border/50 text-muted-foreground"
                    >
                      {conv.otherUser?.role || "user"}
                    </Badge>
                  </div>
                  {conv.lastMessage && (
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {conv.lastMessage.content}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {new Date(conv.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
