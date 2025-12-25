import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2, Plane, UserPlus, Sparkles, Brain, DollarSign, Heart } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col text-white">

      {/* Navbar */}
      <header className="px-6 h-20 flex items-center justify-center border-b border-white/10 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="font-bold text-3xl flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-blue-500" />
          Smart Spaces
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="bg-blue-900/30 text-blue-300 border border-blue-500/30 px-4 py-1.5 rounded-full text-sm font-medium mb-6 inline-flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          AI-Powered Vacation Rentals
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl text-white">
          Smarter Stays.<br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Intelligent Living.
          </span>
        </h1>

        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Where Smart Travel Meets Smart Hosting.
        </p>

        {/* 3 Main Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl mx-auto">
          <Link href="/login?mode=register" className="flex-1">
            <Button size="lg" className="w-full h-14 text-base bg-white text-slate-950 hover:bg-slate-200 border-0">
              <UserPlus className="mr-2 h-5 w-5" />
              Sign Up
            </Button>
          </Link>
          <Link href="/login?role=host" className="flex-1">
            <Button size="lg" variant="outline" className="w-full h-14 text-base border-blue-500 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300">
              <Building2 className="mr-2 h-5 w-5" />
              I&apos;m a Host
            </Button>
          </Link>
          <Link href="/login?role=traveler" className="flex-1">
            <Button size="lg" variant="outline" className="w-full h-14 text-base border-purple-500 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300">
              <Plane className="mr-2 h-5 w-5" />
              I&apos;m a Traveler
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl text-left">
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all">
            <div className="h-10 w-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <Heart className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-white">AI Matching</h3>
            <p className="text-slate-400">Tell us your vibe &mdash; remote work, honeymoon, family trip &mdash; and we&apos;ll show you spaces with match scores tailored to you.</p>
          </div>
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 hover:border-green-500/50 transition-all">
            <div className="h-10 w-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="h-5 w-5 text-green-400" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-white">Smart Pricing</h3>
            <p className="text-slate-400">Hosts get AI-powered price suggestions based on demand, season, and occupancy. Maximize earnings automatically.</p>
          </div>
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all">
            <div className="h-10 w-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <Brain className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-white">AI-Generated Listings</h3>
            <p className="text-slate-400">Hosts just enter an address &mdash; our AI writes compelling titles, descriptions, and suggests optimal pricing.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 text-sm border-t border-white/10">
        <p className="mb-2">Founder and CEO: <span className="text-slate-300">Jason Wolff</span></p>
        <p>© 2025 Smart Spaces. All rights reserved.</p>
      </footer>
    </div>
  )
}
