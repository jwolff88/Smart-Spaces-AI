"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export async function login(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/host-dashboard", // Redirect here after success
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