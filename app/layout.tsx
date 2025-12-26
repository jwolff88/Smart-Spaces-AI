import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://smart-spaces-ai.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Smart Spaces | AI-Powered Vacation Rentals",
    template: "%s | Smart Spaces",
  },
  description: "Find your perfect stay with AI-powered matching. Smart Spaces connects travelers with ideal vacation rentals using intelligent recommendations, smart pricing, and seamless booking.",
  keywords: ["vacation rentals", "AI travel", "smart booking", "holiday homes", "short-term rentals", "travel accommodation", "property management"],
  authors: [{ name: "Smart Spaces" }],
  creator: "Smart Spaces",
  publisher: "Smart Spaces",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Smart Spaces",
    title: "Smart Spaces | AI-Powered Vacation Rentals",
    description: "Find your perfect stay with AI-powered matching. Intelligent recommendations, smart pricing, and seamless booking.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Smart Spaces - AI-Powered Vacation Rentals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Spaces | AI-Powered Vacation Rentals",
    description: "Find your perfect stay with AI-powered matching.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: "your-google-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
        suppressHydrationWarning
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}