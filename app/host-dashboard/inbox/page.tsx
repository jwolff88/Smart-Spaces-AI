"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Send, Sparkles, MoreVertical, Search, Phone, Video } from "lucide-react"

export default function InboxPage() {
  const [selectedChat, setSelectedChat] = useState("chat-1")
  const [inputText, setInputText] = useState("")

  // Mock Data: Guest Conversations
  const chats = [
    {
      id: "chat-1",
      guest: "Alice Freeman",
      property: "The Quiet Loft",
      status: "Check-in Tomorrow",
      lastMsg: "Is there a coffee maker?",
      time: "10m ago",
      unread: true,
      avatar: "AF"
    },
    {
      id: "chat-2",
      guest: "Marcus Chen",
      property: "Sunny Mission Condo",
      status: "Currently Hosting",
      lastMsg: "The lock code worked perfectly, thanks!",
      time: "2h ago",
      unread: false,
      avatar: "MC"
    },
    {
      id: "chat-3",
      guest: "Sarah Jones",
      property: "Ocean Beach Cottage",
      status: "Past Guest",
      lastMsg: "We left the keys on the counter.",
      time: "1d ago",
      unread: false,
      avatar: "SJ"
    }
  ]

  // Mock Data: Message History for selected chat
  const messages = [
    { id: 1, sender: "guest", text: "Hi! We are excited for our trip tomorrow.", time: "10:30 AM" },
    { id: 2, sender: "host", text: "Hello Alice! We are ready for you. The place has been deep cleaned.", time: "10:35 AM" },
    { id: 3, sender: "guest", text: "Great. Quick question: Is there a coffee maker in the unit? And what kind?", time: "10:42 AM" }
  ]

  // AI Generated Suggestions based on the last guest message
  const aiSuggestions = [
    "Yes, we have a Nespresso machine with a variety of pods provided.",
    "There is a standard drip coffee maker and a French press in the kitchen.",
    "We provide a Keurig machine. Would you like us to leave extra pods?"
  ]

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col gap-4 md:flex-row">
      
      {/* --- LEFT SIDE: CHAT LIST --- */}
      <Card className="flex w-full flex-col md:w-[320px] lg:w-[380px]">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search guests..." className="pl-8" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-1 p-2">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`flex items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted ${
                  selectedChat === chat.id ? "bg-muted" : ""
                }`}
              >
                <Avatar>
                  <AvatarFallback>{chat.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{chat.guest}</span>
                    <span className="text-xs text-muted-foreground">{chat.time}</span>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">
                    {chat.property}
                  </div>
                  <p className="line-clamp-1 text-sm text-muted-foreground">
                    {chat.lastMsg}
                  </p>
                </div>
                {chat.unread && (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* --- RIGHT SIDE: CONVERSATION --- */}
      <Card className="flex flex-1 flex-col overflow-hidden">
        
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>AF</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">Alice Freeman</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                  Check-in Tomorrow
                </Badge>
                <span>Oct 14 - 19</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex max-w-[80%] flex-col gap-1 ${
                  msg.sender === "host" ? "ml-auto items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-lg p-3 text-sm ${
                    msg.sender === "host"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-xs text-muted-foreground">{msg.time}</span>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* AI Smart Replies & Input */}
        <div className="p-4 pt-2">
          
          {/* AI Suggestions Area */}
          <div className="mb-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" />
              AI Suggested Responses
            </div>
            <div className="flex flex-wrap gap-2">
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInputText(suggestion)}
                  className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Input Field */}
          <div className="flex gap-2">
            <Input 
              placeholder="Type your message..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1"
            />
            <Button size="icon">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>

      </Card>
    </div>
  )
}