"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, MapPin, ArrowLeft } from "lucide-react"

function GetStartedContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  // Default to traveler if no param is set
  const defaultRole = searchParams.get("role") === "host" ? "host" : "traveler"
  const [role, setRole] = useState<"traveler" | "host">(defaultRole)

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    // MVP Simulation: redirect based on role
    // In a real app, this would call your auth API (Supabase/NextAuth)
    if (role === "host") {
      router.push("/host-dashboard")
    } else {
      router.push("/complete-profile")
    }
  }

  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        
        <Link 
          href="/" 
          className="absolute left-4 top-4 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary md:hidden"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>

        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to create your account
          </p>
        </div>

        <Tabs defaultValue={defaultRole} onValueChange={(v) => setRole(v as "traveler" | "host")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="traveler">I want to Travel</TabsTrigger>
            <TabsTrigger value="host">I want to Host</TabsTrigger>
          </TabsList>
          
          <div className="my-6">
             {role === "traveler" ? (
               <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-900 dark:bg-blue-900/20 dark:text-blue-200">
                 <div className="flex items-center font-medium mb-1">
                   <MapPin className="mr-2 h-4 w-4" />
                   Traveler Benefits:
                 </div>
                 <ul className="list-disc pl-5 space-y-1 text-xs">
                   <li>AI-curated stays matching your vibe</li>
                   <li>Smart price alerts & seamless booking</li>
                 </ul>
               </div>
             ) : (
               <div className="rounded-md bg-purple-50 p-4 text-sm text-purple-900 dark:bg-purple-900/20 dark:text-purple-200">
                 <div className="flex items-center font-medium mb-1">
                   <Building2 className="mr-2 h-4 w-4" />
                   Host Benefits:
                 </div>
                 <ul className="list-disc pl-5 space-y-1 text-xs">
                   <li>Automated pricing & guest messaging</li>
                   <li>Predictive maintenance dashboard</li>
                 </ul>
               </div>
             )}
          </div>

          <form onSubmit={handleSignUp}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="name@example.com" type="email" autoCapitalize="none" autoComplete="email" autoCorrect="off" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </div>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </div>
        </Tabs>
      </div>
    </div>
  )
}

export default function GetStartedPage() {
  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left Side - Visual / Branding */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Building2 className="mr-2 h-6 w-6" />
          Smart Spaces
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This platform completely changed how I manage my rentals. The predictive maintenance alerts saved me thousands in just the first month.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      
      {/* Right Side - Suspense Wrapper */}
      <Suspense fallback={<div>Loading...</div>}>
        <GetStartedContent />
      </Suspense>
    </div>
  )
}