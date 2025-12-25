"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Sparkles, TrendingUp, TrendingDown, DollarSign, Calendar, Activity, ChevronRight } from "lucide-react"

interface PricingData {
  currentPrice: number
  basePrice: number
  suggestedPrice: number
  factors: {
    demandScore: number
    seasonalMultiplier: number
    dayOfWeekMultiplier: number
    occupancyRate: number
  }
  explanation: string[]
  potentialRevenue: {
    withCurrentPrice: number
    withSuggestedPrice: number
  }
}

interface SmartPricingWidgetProps {
  listingId: string
  listingTitle: string
  smartPricingEnabled: boolean
}

export function SmartPricingWidget({
  listingId,
  listingTitle,
  smartPricingEnabled: initialEnabled,
}: SmartPricingWidgetProps) {
  const [pricingData, setPricingData] = useState<PricingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [smartPricing, setSmartPricing] = useState(initialEnabled)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    fetchPricingData()
  }, [listingId])

  const fetchPricingData = async () => {
    try {
      const response = await fetch(`/api/ai/pricing?listingId=${listingId}`)
      if (response.ok) {
        const data = await response.json()
        setPricingData(data)
      }
    } catch (error) {
      console.error("Failed to fetch pricing data:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyPrice = async (price: number) => {
    setApplying(true)
    try {
      const response = await fetch("/api/ai/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          newPrice: price,
          reason: "ai_optimization",
        }),
      })

      if (response.ok) {
        await fetchPricingData()
      }
    } catch (error) {
      console.error("Failed to apply price:", error)
    } finally {
      setApplying(false)
    }
  }

  const toggleSmartPricing = async () => {
    try {
      const response = await fetch("/api/ai/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          smartPricing: !smartPricing,
        }),
      })

      if (response.ok) {
        setSmartPricing(!smartPricing)
      }
    } catch (error) {
      console.error("Failed to toggle smart pricing:", error)
    }
  }

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-4">
          <div className="h-20 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    )
  }

  if (!pricingData) return null

  const priceDiff = pricingData.suggestedPrice - pricingData.currentPrice
  const percentChange = ((priceDiff / pricingData.currentPrice) * 100).toFixed(1)

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-base">Smart Pricing</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Auto-adjust</span>
            <Switch
              checked={smartPricing}
              onCheckedChange={toggleSmartPricing}
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 truncate">{listingTitle}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price Comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-lg border">
            <p className="text-xs text-gray-500 mb-1">Current Price</p>
            <p className="text-2xl font-bold">${pricingData.currentPrice}</p>
          </div>
          <div className="bg-blue-600 text-white p-3 rounded-lg">
            <p className="text-xs text-blue-200 mb-1">AI Suggested</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">${pricingData.suggestedPrice}</p>
              <Badge
                className={`text-xs ${
                  priceDiff > 0 ? "bg-green-500" : priceDiff < 0 ? "bg-orange-500" : "bg-gray-500"
                }`}
              >
                {priceDiff > 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {priceDiff > 0 ? "+" : ""}{percentChange}%
              </Badge>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        {priceDiff !== 0 && (
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => applyPrice(pricingData.suggestedPrice)}
            disabled={applying}
          >
            {applying ? "Applying..." : `Apply $${pricingData.suggestedPrice}/night`}
          </Button>
        )}

        {/* Expand/Collapse */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 text-xs text-blue-600 hover:text-blue-800"
        >
          {expanded ? "Hide details" : "Show pricing factors"}
          <ChevronRight className={`h-3 w-3 transition-transform ${expanded ? "rotate-90" : ""}`} />
        </button>

        {/* Expanded Details */}
        {expanded && (
          <div className="space-y-3 pt-2 border-t">
            {/* Factors */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                <Activity className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-gray-500">Demand</p>
                  <p className="font-medium">{pricingData.factors.demandScore}/100</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                <Calendar className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-gray-500">Season</p>
                  <p className="font-medium">x{pricingData.factors.seasonalMultiplier.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                <DollarSign className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-gray-500">Base Price</p>
                  <p className="font-medium">${pricingData.basePrice}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-gray-500">Occupancy</p>
                  <p className="font-medium">{pricingData.factors.occupancyRate}%</p>
                </div>
              </div>
            </div>

            {/* Explanations */}
            {pricingData.explanation.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-700">Why this price?</p>
                {pricingData.explanation.map((reason, i) => (
                  <p key={i} className="text-xs text-gray-500">• {reason}</p>
                ))}
              </div>
            )}

            {/* Revenue Projection */}
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <p className="text-xs font-medium text-green-800 mb-2">30-Day Revenue Projection</p>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Current: ${pricingData.potentialRevenue.withCurrentPrice}</span>
                <span className="text-green-600 font-medium">
                  Optimized: ${pricingData.potentialRevenue.withSuggestedPrice}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
