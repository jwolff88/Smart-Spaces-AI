import Link from "next/link"
import { signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { Plus, LogOut } from "lucide-react"

/*
  HOST DASHBOARD LAYOUT
  Philosophy: Holographic Iridescent Fluid

  - Pure black with fluid gradient orbs
  - Multi-color iridescent effects
  - Glass morphism with purple/pink accents
  - Smooth gradient navigation
*/

const navItems = [
  { href: "/host-dashboard", label: "Overview" },
  { href: "/host-dashboard/listings", label: "Properties" },
  { href: "/host-dashboard/inbox", label: "Messages" },
  { href: "/host-dashboard/calendar", label: "Calendar" },
  { href: "/host-dashboard/analytics", label: "Analytics" },
  { href: "/host-dashboard/maintenance", label: "Maintenance" },
]

export default function HostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background relative bg-holo-shimmer">
      {/* Fluid gradient orbs */}
      <div className="orb-purple w-[500px] h-[500px] top-[-100px] right-[-100px] opacity-40" />
      <div className="orb-pink w-[400px] h-[400px] bottom-[20%] left-[-100px] opacity-30" />
      <div className="orb-green w-[350px] h-[350px] top-[30%] left-[5%] opacity-30" />
      <div className="orb-cyan w-[300px] h-[300px] top-[40%] right-[10%] opacity-25" />

      {/* --- TOP NAVIGATION --- */}
      <header className="sticky top-0 z-50 glass-dark">
        <div className="max-w-6xl mx-auto px-6">
          {/* Top bar */}
          <div className="h-16 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold tracking-wider">
              <span className="text-holo">SMART SPACES</span>
            </Link>

            {/* Desktop: Secondary actions */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/host-dashboard/add-property">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white glow-holo transition-all">
                  <Plus className="mr-2 h-4 w-4" /> Add Property
                </Button>
              </Link>
              <form
                action={async () => {
                  "use server"
                  await signOut({ redirectTo: "/" })
                }}
              >
                <Button variant="outline" type="submit" className="border-pink-500/40 text-pink-400 hover:bg-pink-500/10 hover:border-pink-400 transition-all">
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
              </form>
            </div>

            {/* Mobile: Hamburger */}
            <div className="md:hidden">
              <MobileNav variant="host" />
            </div>
          </div>

          {/* Navigation tabs - Desktop only */}
          <nav className="hidden md:flex items-center gap-1 -mb-px">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-3 text-sm text-muted-foreground hover:text-purple-400 border-b-2 border-transparent hover:border-purple-500/50 transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="max-w-6xl mx-auto px-6 py-8 md:py-12 relative z-10">
        {children}
      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-purple-500/20 mt-auto glass-dark">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-sm text-muted-foreground">
            © 2025 <span className="text-holo-static">Smart Spaces</span>
          </p>
        </div>
      </footer>
    </div>
  )
}