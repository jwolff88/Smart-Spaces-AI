"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { registerUser } from "@/app/actions/register"
import { login } from "@/app/actions/login"
import { Loader2, Building2, Plane, Sparkles, ArrowLeft } from "lucide-react"

function AuthContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Determine initial mode from URL params
  const mode = searchParams.get("mode") // "register" or null (login)
  const roleParam = searchParams.get("role") // "host" or "traveler"

  const [isRegister, setIsRegister] = useState(mode === "register")
  const [selectedRole, setSelectedRole] = useState<"host" | "traveler">(
    roleParam === "host" ? "host" : "traveler"
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)

    if (isRegister) {
      // Add role to form data for registration
      formData.set("role", selectedRole)

      const result = await registerUser(formData)
      if (result.error) {
        setError(result.error)
        setIsLoading(false)
      } else {
        // Auto-login after registration
        const loginResult = await login(formData)
        if (loginResult?.error) {
          setError(loginResult.error)
          setIsLoading(false)
        }
        // Redirect handled by login action based on role
      }
    } else {
      // Login - pass the intended role for redirect
      formData.set("intendedRole", roleParam || "")

      try {
        const result = await login(formData)
        if (result?.error) {
          setError(result.error)
        }
      } catch (e) {
        // Redirects throw in Next.js, ignore
      }
      setIsLoading(false)
    }
  }

  // Determine the title and description based on context
  const getTitle = () => {
    if (isRegister) return "Create an account"
    if (roleParam === "host") return "Host Sign In"
    if (roleParam === "traveler") return "Traveler Sign In"
    return "Welcome back"
  }

  const getDescription = () => {
    if (isRegister) return "Choose your role and create your account"
    if (roleParam === "host") return "Sign in to access your host dashboard"
    if (roleParam === "traveler") return "Sign in to manage your trips"
    return "Enter your email to sign in"
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Link
        href="/"
        className="absolute left-4 top-4 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary md:left-8 md:top-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-6 w-6" />
              <span className="font-bold text-xl">Smart Spaces</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {getTitle()}
          </CardTitle>
          <CardDescription className="text-center">
            {getDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Role Selection - Only show for registration */}
            {isRegister && (
              <div className="space-y-2">
                <Label>I am a...</Label>
                <Tabs
                  value={selectedRole}
                  onValueChange={(v) => setSelectedRole(v as "host" | "traveler")}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="host" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Host
                    </TabsTrigger>
                    <TabsTrigger value="traveler" className="flex items-center gap-2">
                      <Plane className="h-4 w-4" />
                      Traveler
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {selectedRole === "host"
                    ? "List your properties and manage bookings"
                    : "Browse listings and book your perfect stay"}
                </p>
              </div>
            )}

            {/* Name - Only for registration */}
            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isRegister ? "Create Account" : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            variant="link"
            className="w-full"
            onClick={() => {
              setIsRegister(!isRegister)
              setError(null)
            }}
          >
            {isRegister
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <AuthContent />
    </Suspense>
  )
}
