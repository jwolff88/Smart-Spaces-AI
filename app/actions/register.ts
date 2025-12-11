"use server"

import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export const registerUser = async (formData: FormData) => {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  if (!email || !password) {
    return { error: "Missing fields" }
  }

  // Check if user exists
  const existingUser = await db.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    return { error: "Email already in use" }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create user
  await db.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    }
  })

  return { success: "User created!" }
}