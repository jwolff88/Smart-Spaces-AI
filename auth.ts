import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from "@/lib/db"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string

        // Find user in DB
        const user = await db.user.findUnique({
          where: { email },
        })

        if (!user || !user.password) {
          return null
        }

        // Check if password matches
        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (passwordsMatch) {
          return user
        }

        return null
      },
    }),
  ],
  callbacks: {
    // Add User ID to the session so we know WHO is logged in
    session: async ({ session, token }) => {
      if (session?.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.sub = user.id
      }
      return token
    }
  }
})