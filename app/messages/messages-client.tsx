"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ConversationList } from "@/components/conversation-list"
import { ChatWindow } from "@/components/chat-window"
import { ArrowLeft, MessageSquare } from "lucide-react"

interface MessagesClientProps {
  userId: string
}

export function MessagesClient({ userId }: MessagesClientProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Messages
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <div className="grid md:grid-cols-3 gap-4 h-[calc(100vh-8rem)]">
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
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
