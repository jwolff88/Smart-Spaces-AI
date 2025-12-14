import { NextResponse } from "next/server"

export async function POST(req: Request) {
  // MOCK MODE: Returns static text to unblock the form
  try {
    // 1. We still simulate receiving data so the app feels real
    const body = await req.json()
    const { address, type, bedrooms } = body

    // 2. Return a fake success response immediately
    const mockResponse = {
      title: `Beautiful ${bedrooms}-Bed ${type} in ${address}`,
      description: `This is a placeholder description to let you test the image feature. 
      
      The AI is currently bypassed so you can click Publish without errors. 
      
      Once you confirm the image works, we can turn the real AI back on.`,
      suggestedPrice: 250
    }

    return NextResponse.json(mockResponse)

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate mock data" }, 
      { status: 500 }
    )
  }
}