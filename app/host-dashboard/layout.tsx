import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import {
  LayoutDashboard,
  Home,
  MessageSquare,
  Calendar,
  Wrench,
  Settings,
  LogOut,
  Bell,
  BarChart3,
  Sparkles
} from "lucide-react"

export default function HostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">

      {/* --- SIDEBAR (Desktop) --- */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">

          {/* Logo Area */}
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Smart Spaces</span>
              <span className="text-xs font-normal text-muted-foreground bg-primary/10 text-primary px-2 py-0.5 rounded-full">Host</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/host-dashboard"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <LayoutDashboard className="h-4 w-4" />
                Overview
              </Link>
              <Link
                href="/host-dashboard/listings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Listings
              </Link>
              <Link
                href="/host-dashboard/inbox"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <MessageSquare className="h-4 w-4" />
                Inbox
              </Link>
              <Link
                href="/host-dashboard/calendar"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Calendar className="h-4 w-4" />
                Calendar
              </Link>
              <Link
                href="/host-dashboard/analytics"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Link>
              <Link
                href="/host-dashboard/maintenance"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Wrench className="h-4 w-4" />
                Maintenance
              </Link>
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="mt-auto p-4">
             <nav className="grid items-start gap-2 text-sm font-medium">
              <Link
                href="/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
               <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Link>
             </nav>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex flex-col">
        {/* Mobile Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 md:hidden">
          <MobileNav variant="host" />
          <div className="flex items-center gap-2 font-semibold flex-1">
            <Sparkles className="h-5 w-5 text-primary" />
            Smart Spaces
          </div>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Bell className="h-4 w-4" />
          </Button>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}