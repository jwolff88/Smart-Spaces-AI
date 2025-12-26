import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Smart Spaces to manage your bookings, list properties, and access AI-powered travel recommendations.",
  openGraph: {
    title: "Sign In | Smart Spaces",
    description: "Sign in to Smart Spaces to manage your bookings and properties.",
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
