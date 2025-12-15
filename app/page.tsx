import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2, Map, ShieldCheck, Sparkles } from "lucide-react"

export default function LandingPage() {
  return (
    // Changed background to dark slate/blue gradient for better contrast
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col text-white">
      
      {/* Navbar - Dark background with blur */}
      <header className="px-6 h-16 flex items-center justify-between border-b border-white/10 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="font-bold text-xl flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          SmartSpaces.ai
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            {/* Explicitly set text color to ensure visibility */}
            <Button variant="ghost" className="text-slate-200 hover:text-white hover:bg-white/10">
              Sign In
            </Button>
          </Link>
          <Link href="/host-dashboard/add-property">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0">
              Become a Host
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="bg-blue-900/30 text-blue-300 border border-blue-500/30 px-4 py-1.5 rounded-full text-sm font-medium mb-6 inline-flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          The Future of Rental Infrastructure
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl text-white">
          Intelligent hosting for <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            modern travelers.
          </span>
        </h1>
        
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Experience AI-optimized listings, seamless bookings, and smart pricing. 
          Whether you&apos;re hosting or traveling, we handle the complexity.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
          <Link href="/search" className="flex-1">
            <Button size="lg" className="w-full h-12 text-base bg-white text-slate-950 hover:bg-slate-200 border-0">
              <Map className="mr-2 h-5 w-5" />
              Find a Stay
            </Button>
          </Link>
          <Link href="/host-dashboard" className="flex-1">
            <Button size="lg" variant="outline" className="w-full h-12 text-base border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white">
              <Building2 className="mr-2 h-5 w-5" />
              I&apos;m a Host
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl text-left">
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all">
            <div className="h-10 w-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-white">AI-Powered Listings</h3>
            <p className="text-slate-400">Our AI writes high-converting descriptions and optimizes your pricing automatically.</p>
          </div>
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 hover:border-green-500/50 transition-all">
            <div className="h-10 w-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <ShieldCheck className="h-5 w-5 text-green-400" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-white">Verified Hosts</h3>
            <p className="text-slate-400">Every host is verified to ensure safe, quality stays for all travelers.</p>
          </div>
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all">
            <div className="h-10 w-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <Map className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-white">Smart Discovery</h3>
            <p className="text-slate-400">Find the perfect stay with our intelligent search and matching engine.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-600 text-sm border-t border-white/10">
        © 2024 SmartSpaces.ai. All rights reserved.
      </footer>
    </div>
  )
}