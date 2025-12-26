import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

// GET conversations for current user
export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get("conversationId")

    // If conversationId provided, get messages for that conversation
    if (conversationId) {
      // Verify user is participant
      const participant = await db.conversationParticipant.findUnique({
        where: {
          conversationId_userId: {
            conversationId,
            userId: session.user.id,
          },
        },
      })

      if (!participant) {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 })
      }

      // Get messages
      const messages = await db.message.findMany({
        where: { conversationId },
        include: {
          sender: {
            select: { id: true, name: true, image: true },
          },
        },
        orderBy: { createdAt: "asc" },
      })

      // Update last read
      await db.conversationParticipant.update({
        where: { id: participant.id },
        data: { lastReadAt: new Date() },
      })

      return NextResponse.json(messages)
    }

    // Get all conversations for user
    const conversations = await db.conversation.findMany({
      where: {
        participants: {
          some: { userId: session.user.id },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, name: true, image: true, role: true },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            sender: {
              select: { id: true, name: true },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    // Format conversations with unread count
    const formattedConversations = conversations.map((conv) => {
      const currentParticipant = conv.participants.find(
        (p) => p.userId === session.user.id
      )
      const otherParticipant = conv.participants.find(
        (p) => p.userId !== session.user.id
      )
      const lastMessage = conv.messages[0]

      // Count unread messages
      const unreadCount = currentParticipant?.lastReadAt
        ? conv.messages.filter(
            (m) =>
              m.senderId !== session.user.id &&
              m.createdAt > currentParticipant.lastReadAt!
          ).length
        : conv.messages.filter((m) => m.senderId !== session.user.id).length

      return {
        id: conv.id,
        otherUser: otherParticipant?.user || null,
        lastMessage: lastMessage
          ? {
              content: lastMessage.content,
              senderId: lastMessage.senderId,
              senderName: lastMessage.sender.name,
              createdAt: lastMessage.createdAt,
            }
          : null,
        unreadCount,
        updatedAt: conv.updatedAt,
      }
    })

    return NextResponse.json(formattedConversations)
  } catch (error) {
    console.error("Failed to fetch messages:", error)
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

// POST send a message
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { conversationId, recipientId, content, listingId } = body

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Message content required" },
        { status: 400 }
      )
    }

    let targetConversationId = conversationId

    // If no conversationId, create or find existing conversation
    if (!targetConversationId && recipientId) {
      // Check for existing conversation between these users
      const existingConversation = await db.conversation.findFirst({
        where: {
          AND: [
            { participants: { some: { userId: session.user.id } } },
            { participants: { some: { userId: recipientId } } },
          ],
          // If listingId provided, match it
          ...(listingId ? { listingId } : {}),
        },
      })

      if (existingConversation) {
        targetConversationId = existingConversation.id
      } else {
        // Create new conversation
        const newConversation = await db.conversation.create({
          data: {
            listingId: listingId || null,
            participants: {
              create: [
                { userId: session.user.id },
                { userId: recipientId },
              ],
            },
          },
        })
        targetConversationId = newConversation.id
      }
    }

    if (!targetConversationId) {
      return NextResponse.json(
        { error: "Conversation or recipient required" },
        { status: 400 }
      )
    }

    // Verify user is participant
    const participant = await db.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId: targetConversationId,
          userId: session.user.id,
        },
      },
    })

    if (!participant) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    // Create message
    const message = await db.message.create({
      data: {
        content: content.trim(),
        conversationId: targetConversationId,
        senderId: session.user.id,
      },
      include: {
        sender: {
          select: { id: true, name: true, image: true },
        },
      },
    })

    // Update conversation timestamp
    await db.conversation.update({
      where: { id: targetConversationId },
      data: { updatedAt: new Date() },
    })

    // Update sender's last read
    await db.conversationParticipant.update({
      where: { id: participant.id },
      data: { lastReadAt: new Date() },
    })

    return NextResponse.json({
      message,
      conversationId: targetConversationId,
    })
  } catch (error) {
    console.error("Failed to send message:", error)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}
