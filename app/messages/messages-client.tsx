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
    <div className="min-h-screen bg-background bg-grid relative">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-neon">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-foreground flex items-center gap-2 text-glow-cyan">
              <MessageSquare className="h-5 w-5 text-primary" />
              Messages
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 relative z-10">
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
              <div className="h-full flex items-center justify-center glass-neon rounded-lg">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-primary/50" />
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
