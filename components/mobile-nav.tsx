"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Menu,
  Home,
  Search,
  Calendar,
  MessageSquare,
  LogOut,
  LayoutDashboard,
  Building,
  Wrench,
  BarChart3,
  Sparkles,
  User,
} from "lucide-react"

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  badge?: string | number
}

interface MobileNavProps {
  variant: "host" | "guest" | "public"
  userName?: string
  onSignOut?: () => void
}

const hostNavItems: NavItem[] = [
  { href: "/host-dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/host-dashboard/listings", label: "Listings", icon: Building },
  { href: "/host-dashboard/inbox", label: "Inbox", icon: MessageSquare },
  { href: "/host-dashboard/calendar", label: "Calendar", icon: Calendar },
  { href: "/host-dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/host-dashboard/maintenance", label: "Maintenance", icon: Wrench },
]

const guestNavItems: NavItem[] = [
  { href: "/search", label: "Explore", icon: Search },
  { href: "/guest-dashboard", label: "My Trips", icon: Calendar },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/onboarding", label: "Preferences", icon: User },
]

const publicNavItems: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Explore", icon: Search },
  { href: "/login?role=host", label: "Host", icon: Building },
  { href: "/login?role=traveler", label: "Travel", icon: User },
]

export function MobileNav({ variant, userName, onSignOut }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const navItems = variant === "host"
    ? hostNavItems
    : variant === "guest"
    ? guestNavItems
    : publicNavItems

  const isActive = (href: string) => {
    if (href === "/host-dashboard" || href === "/guest-dashboard") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Smart Spaces
            {variant === "host" && (
              <span className="text-xs font-normal bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                Host
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {userName && (
          <div className="px-4 py-3 border-b bg-muted/50">
            <p className="text-sm text-muted-foreground">Signed in as</p>
            <p className="font-medium truncate">{userName}</p>
          </div>
        )}

        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
                {item.badge && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {(variant === "host" || variant === "guest") && onSignOut && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
            <button
              onClick={() => {
                setOpen(false)
                onSignOut()
              }}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 w-full text-left"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
