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
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="py-8">
          <p className="text-slate-400 text-center">Loading conversations...</p>
        </CardContent>
      </Card>
    )
  }

  if (conversations.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-center py-4">No conversations yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-700">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={`w-full p-4 text-left hover:bg-slate-700/50 transition-colors ${
                selectedId === conv.id ? "bg-slate-700" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-600 flex items-center justify-center text-white font-medium flex-shrink-0">
                  {conv.otherUser?.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-white truncate">
                      {conv.otherUser?.name || "Unknown User"}
                    </p>
                    {conv.unreadCount > 0 && (
                      <Badge className="bg-blue-600 text-white text-xs">
                        {conv.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-xs border-slate-600 text-slate-400"
                    >
                      {conv.otherUser?.role || "user"}
                    </Badge>
                  </div>
                  {conv.lastMessage && (
                    <p className="text-sm text-slate-400 truncate mt-1">
                      {conv.lastMessage.content}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
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
