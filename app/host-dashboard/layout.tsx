import Link from "next/link"
import { signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { Plus, LogOut } from "lucide-react"

/*
  HOST DASHBOARD LAYOUT
  Philosophy: Editorial navigation, not admin panel

  - Horizontal top nav instead of sidebar
  - Content-first approach
  - Typography-led navigation
  - Breathing room
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
    <div className="min-h-screen bg-background">
      {/* --- TOP NAVIGATION --- */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6">
          {/* Top bar */}
          <div className="h-16 flex items-center justify-between">
            <Link
              href="/"
              className="text-lg font-medium tracking-tight text-foreground"
            >
              Smart Spaces
            </Link>

            {/* Desktop: Secondary actions */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/host-dashboard/add-property">
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Property
                </Button>
              </Link>
              <form
                action={async () => {
                  "use server"
                  await signOut()
                }}
              >
                <Button variant="outline" type="submit">
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
                className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-foreground/20 transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="max-w-6xl mx-auto px-6 py-8 md:py-12">
        {children}
      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-border mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-sm text-muted-foreground">
            © 2025 Smart Spaces
          </p>
        </div>
      </footer>
    </div>
  )
}