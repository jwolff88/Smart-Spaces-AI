"use client"

import { useEffect, useState } from "react"
import { AdminLogin } from "@/components/admin-login"
import { AdminDashboard } from "@/components/admin-dashboard"

type AuthStatus = "loading" | "authenticated" | "unauthenticated"

export default function AdminPage() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading")

   
  useEffect(() => {
    const storedAuth = localStorage.getItem("admin_authenticated")
    if (storedAuth === "true") {
      setAuthStatus("authenticated")
    } else {
      setAuthStatus("unauthenticated")
    }
  }, [])

  const handleLogin = (success: boolean) => {
    if (success) {
      setAuthStatus("authenticated")
      localStorage.setItem("admin_authenticated", "true")
    }
  }

  const handleLogout = () => {
    setAuthStatus("unauthenticated")
    localStorage.removeItem("admin_authenticated")
  }

  if (authStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {authStatus !== "authenticated" ? (
        <AdminLogin onLogin={handleLogin} />
      ) : (
        <AdminDashboard onLogout={handleLogout} />
      )}
    </div>
  )
}
