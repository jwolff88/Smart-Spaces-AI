import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, message, rating, type } = body

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Feedback message is required" },
        { status: 400 }
      )
    }

    const feedback = await db.feedback.create({
      data: {
        email: email || null,
        name: name || null,
        message: message.trim(),
        rating: rating ? parseInt(rating) : null,
        type: type || "general",
      },
    })

    return NextResponse.json({ success: true, id: feedback.id })
  } catch (error) {
    console.error("Error saving feedback:", error)
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const feedback = await db.feedback.findMany({
      orderBy: { createdAt: "desc" },
      take: 10, // Show latest 10 feedback entries
    })
    return NextResponse.json(feedback)
  } catch (error) {
    console.error("Error fetching feedback:", error)
    return NextResponse.json([], { status: 500 })
  }
}
