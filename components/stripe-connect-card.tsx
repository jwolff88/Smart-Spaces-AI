"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, ExternalLink, Loader2, CreditCard, RefreshCw, Gift } from "lucide-react"

interface ConnectStatus {
  hasAccount: boolean
  accountId: string | null
  status: string | null
  isComplete: boolean
  payoutsEnabled?: boolean
  detailsSubmitted?: boolean
  trial?: {
    isActive: boolean
    daysRemaining: number
    endsAt: string
  }
}

interface StripeConnectCardProps {
  initialStatus?: "success" | "refresh" | null
}

export function StripeConnectCard({ initialStatus }: StripeConnectCardProps) {
  const [connectStatus, setConnectStatus] = useState<ConnectStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Show message based on URL params
  useEffect(() => {
    if (initialStatus === "success") {
      setMessage({ type: "success", text: "Your account is being verified. This may take a few minutes." })
    } else if (initialStatus === "refresh") {
      setMessage({ type: "error", text: "Your session expired. Please try connecting again." })
    }
  }, [initialStatus])

  // Fetch Connect status
  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/stripe/connect")
        if (res.ok) {
          const data = await res.json()
          setConnectStatus(data)
        }
      } catch (error) {
        console.error("Failed to fetch Connect status:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
  }, [])

  // Start Connect onboarding
  const handleConnect = async () => {
    setConnecting(true)
    setMessage(null)
    try {
      const res = await fetch("/api/stripe/connect", { method: "POST" })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to start onboarding")
      }

      // Redirect to Stripe onboarding
      window.location.href = data.url
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to connect" })
      setConnecting(false)
    }
  }

  // Refresh status
  const handleRefresh = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/stripe/connect")
      if (res.ok) {
        const data = await res.json()
        setConnectStatus(data)
        if (data.isComplete) {
          setMessage({ type: "success", text: "Your account is now active!" })
        }
      }
    } catch (error) {
      console.error("Failed to refresh status:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Fully connected and payouts enabled
  if (connectStatus?.isComplete) {
    const trial = connectStatus.trial
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Payouts Connected
            </CardTitle>
            <div className="flex gap-2">
              {trial?.isActive && (
                <Badge className="bg-purple-600">
                  <Gift className="h-3 w-3 mr-1" />
                  Free Trial
                </Badge>
              )}
              <Badge className="bg-green-600">Active</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {trial?.isActive ? (
            <div className="bg-purple-100 border border-purple-200 rounded-lg p-3">
              <p className="text-sm font-medium text-purple-800 flex items-center gap-2">
                <Gift className="h-4 w-4" />
                Free Trial: {trial.daysRemaining} days remaining
              </p>
              <p className="text-xs text-purple-600 mt-1">
                You're keeping 100% of your earnings! After the trial, the platform fee is 10%.
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Your bank account is connected. You'll receive 90% of each booking automatically.
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  // Has account but not complete
  if (connectStatus?.hasAccount && !connectStatus.isComplete) {
    return (
      <Card className="border-yellow-200 bg-yellow-50/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              Setup Incomplete
            </CardTitle>
            <Badge className="bg-yellow-500">Pending</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {message && (
            <div className={`text-sm p-2 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {message.text}
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Please complete your account setup to receive payouts. You may need to provide additional verification.
          </p>
          <div className="flex gap-2">
            <Button onClick={handleConnect} disabled={connecting} size="sm">
              {connecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Continue Setup <ExternalLink className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // No account - prompt to connect
  const trial = connectStatus?.trial
  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Connect Your Bank Account
          </CardTitle>
          {trial?.isActive && (
            <Badge className="bg-purple-600">
              <Gift className="h-3 w-3 mr-1" />
              Free Trial
            </Badge>
          )}
        </div>
        <CardDescription>
          Set up payouts to receive money from your bookings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {trial?.isActive && (
          <div className="bg-purple-100 border border-purple-200 rounded-lg p-3">
            <p className="text-sm font-medium text-purple-800 flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Free for {trial.daysRemaining} more days!
            </p>
            <p className="text-xs text-purple-600 mt-1">
              Keep 100% of your earnings during the trial period. No platform fees!
            </p>
          </div>
        )}
        {message && (
          <div className={`text-sm p-2 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message.text}
          </div>
        )}
        <p className="text-sm text-muted-foreground">
          {trial?.isActive
            ? "Connect your bank account through Stripe to receive 100% of each booking during your free trial."
            : "Connect your bank account through Stripe to receive 90% of each booking. The platform fee is 10%."}
        </p>
        <Button onClick={handleConnect} disabled={connecting}>
          {connecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              Connect Bank Account <ExternalLink className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
