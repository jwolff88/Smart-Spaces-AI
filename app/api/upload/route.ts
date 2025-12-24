import { NextResponse } from "next/server"
import { auth } from "@/auth"

// Cloudinary upload endpoint
// Uses unsigned upload preset for simplicity
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      return NextResponse.json(
        { error: "Image upload not configured. Contact support." },
        { status: 503 }
      )
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPG, PNG, WebP, GIF" },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB" },
        { status: 400 }
      )
    }

    // Upload to Cloudinary
    const cloudinaryFormData = new FormData()
    cloudinaryFormData.append("file", file)
    cloudinaryFormData.append("upload_preset", uploadPreset)
    cloudinaryFormData.append("folder", "smart-spaces/listings")

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: cloudinaryFormData,
      }
    )

    if (!cloudinaryResponse.ok) {
      const error = await cloudinaryResponse.text()
      console.error("Cloudinary upload failed:", error)
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      )
    }

    const cloudinaryData = await cloudinaryResponse.json()

    return NextResponse.json({
      url: cloudinaryData.secure_url,
      publicId: cloudinaryData.public_id,
      width: cloudinaryData.width,
      height: cloudinaryData.height,
    })
  } catch (error) {
    console.error("POST /api/upload error:", error)
    return NextResponse.json(
      { error: "Failed to process upload" },
      { status: 500 }
    )
  }
}
