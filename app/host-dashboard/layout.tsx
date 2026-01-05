import Link from "next/link"
import { signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { Plus, LogOut } from "lucide-react"

/*
  HOST DASHBOARD LAYOUT
  Philosophy: Neon Futuristic Holographic

  - Dark background with cyan grid
  - Glowing navigation elements
  - Glass morphism header
  - Neon accent colors
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
    <div className="min-h-screen bg-background bg-grid relative">
      {/* Ambient glow */}
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      {/* --- TOP NAVIGATION --- */}
      <header className="sticky top-0 z-50 glass-neon">
        <div className="max-w-6xl mx-auto px-6">
          {/* Top bar */}
          <div className="h-16 flex items-center justify-between">
            <Link
              href="/"
              className="text-lg font-bold tracking-wider text-foreground text-glow-cyan"
            >
              SMART SPACES
            </Link>

            {/* Desktop: Secondary actions */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/host-dashboard/add-property">
                <Button className="bg-primary hover:bg-primary/80 glow-cyan hover:shadow-[0_0_25px_rgba(0,255,255,0.5)] transition-all">
                  <Plus className="mr-2 h-4 w-4" /> Add Property
                </Button>
              </Link>
              <form
                action={async () => {
                  "use server"
                  await signOut()
                }}
              >
                <Button variant="outline" type="submit" className="border-border/50 hover:border-secondary/50 hover:glow-magenta transition-all">
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
                className="px-4 py-3 text-sm text-muted-foreground hover:text-primary border-b-2 border-transparent hover:border-primary/50 transition-all duration-200"
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
      <footer className="border-t border-border/50 mt-auto glass-neon">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-sm text-muted-foreground">
            © 2025 <span className="text-primary">Smart Spaces</span>
          </p>
        </div>
      </footer>
    </div>
  )
}