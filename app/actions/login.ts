"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { db } from "@/lib/db"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const intendedRole = formData.get("intendedRole") as string // From URL param (host or traveler)

  // Look up user to get their role for redirect
  const user = await db.user.findUnique({
    where: { email },
    select: { role: true }
  })

  // Determine redirect based on:
  // 1. If coming from "I'm a Host" button, go to host dashboard
  // 2. If coming from "I'm a Traveler" button, go to guest dashboard
  // 3. Otherwise, use the user's stored role
  let redirectTo = "/guest-dashboard" // Default for travelers/guests

  if (intendedRole === "host") {
    redirectTo = "/host-dashboard"
  } else if (intendedRole === "traveler") {
    redirectTo = "/guest-dashboard"
  } else if (user?.role === "host") {
    redirectTo = "/host-dashboard"
  }

  try {
    await signIn("credentials", {
      email,
      password: formData.get("password"),
      redirectTo,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." }
        default:
          return { error: "Something went wrong." }
      }
    }
    // NextAuth redirects throw an error, so we must rethrow it
    throw error
  }
}
