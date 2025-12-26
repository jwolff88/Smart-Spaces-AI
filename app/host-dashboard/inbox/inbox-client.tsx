"use client"

import { useState } from "react"
import { ConversationList } from "@/components/conversation-list"
import { ChatWindow } from "@/components/chat-window"
import { MessageSquare } from "lucide-react"

interface HostInboxClientProps {
  userId: string
}

export function HostInboxClient({ userId }: HostInboxClientProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)

  return (
    <div className="grid md:grid-cols-3 gap-4 h-[calc(100vh-180px)]">
      {/* Conversation List - hide on mobile when chat selected */}
      <div className={`md:col-span-1 ${selectedConversation ? "hidden md:block" : ""}`}>
        <ConversationList
          onSelect={setSelectedConversation}
          selectedId={selectedConversation || undefined}
        />
      </div>

      {/* Chat Window */}
      <div className={`md:col-span-2 ${!selectedConversation ? "hidden md:block" : ""}`}>
        {selectedConversation ? (
          <ChatWindow
            conversationId={selectedConversation}
            currentUserId={userId}
            onBack={() => setSelectedConversation(null)}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-slate-800 rounded-lg border border-slate-700">
            <div className="text-center text-slate-400">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a conversation to view messages</p>
              <p className="text-sm mt-2">
                Guests can contact you from your listing pages
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
