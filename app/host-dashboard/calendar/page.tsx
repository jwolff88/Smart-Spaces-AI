import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight, Zap, User, Plus } from "lucide-react"

export default function CalendarPage() {
  // Mock Data: Days in October (starting Monday for visual simplicity)
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  
  // Mock Logic: Simulate status for specific days
  const getDayStatus = (day: number) => {
    // Booked dates
    if (day >= 14 && day <= 19) return { status: "booked", guest: "Alice F.", price: 145 }
    if (day === 24 || day === 25) return { status: "booked", guest: "Marcus", price: 160 }
    
    // High demand / Smart Priced dates
    if (day === 31) return { status: "available", smartPrice: true, price: 250, label: "Halloween" }
    if (day >= 28 && day <= 30) return { status: "available", smartPrice: true, price: 185, label: "Event" }
    
    // Standard available dates
    return { status: "available", smartPrice: false, price: 135 }
  }

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-120px)]">
      
      {/* --- CALENDAR HEADER --- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold md:text-2xl">Calendar</h1>
          <div className="flex items-center rounded-md border bg-background shadow-sm">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none rounded-l-md">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-4 text-sm font-medium">October 2024</div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none rounded-r-md">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline">Sync Calendars</Button>
           <Button>
            <Plus className="mr-2 h-4 w-4" /> Manual Booking
           </Button>
        </div>
      </div>

      {/* --- CALENDAR GRID --- */}
      <div className="flex flex-1 gap-6 overflow-hidden">
        
        {/* Main Grid */}
        <div className="flex-1 rounded-lg border bg-background shadow-sm overflow-hidden flex flex-col">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b bg-muted/40 text-center text-xs font-semibold text-muted-foreground p-2">
            <div>MON</div>
            <div>TUE</div>
            <div>WED</div>
            <div>THU</div>
            <div>FRI</div>
            <div>SAT</div>
            <div>SUN</div>
          </div>
          
          {/* Days Grid */}
          <div className="grid grid-cols-7 flex-1 auto-rows-fr">
            {/* Empty cells for previous month padding (assuming Oct starts on Tue for this visual mock) */}
            <div className="border-r border-b bg-muted/5"></div>
            
            {days.map((day) => {
              const info = getDayStatus(day)
              return (
                <div 
                  key={day} 
                  className={`relative flex flex-col justify-between border-r border-b p-2 transition-colors hover:bg-muted/50 ${
                    info.status === "booked" ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-sm font-medium ${day === 14 ? "rounded-full bg-primary text-primary-foreground h-6 w-6 flex items-center justify-center" : "text-muted-foreground"}`}>
                      {day}
                    </span>
                    {info.smartPrice && (
                       <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
                    )}
                  </div>

                  {/* Booking Bar */}
                  {info.status === "booked" && (
                    <div className="mt-2 rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground truncate shadow-sm">
                      {info.guest}
                    </div>
                  )}

                  {/* Price Label */}
                  <div className="mt-auto text-right">
                    <div className={`text-xs font-medium ${info.smartPrice ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}>
                      ${info.price}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* --- SIDEBAR DETAILS (Selected Date) --- */}
        <Card className="w-[300px] hidden xl:block">
          <CardHeader>
            <CardTitle>Monday, Oct 14</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Guest Details */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">RESERVATION</h3>
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Alice Freeman</div>
                  <div className="text-xs text-muted-foreground">5 nights · $825</div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Smart Pricing Logic */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                 <h3 className="text-sm font-medium text-muted-foreground">PRICING INSIGHTS</h3>
                 <Badge variant="outline" className="text-xs border-amber-200 text-amber-600 bg-amber-50">
                    Smart Mode
                 </Badge>
              </div>
              
              <div className="rounded-lg bg-muted/50 p-3 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Base Rate</span>
                  <span className="text-muted-foreground">$135</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Demand Surge</span>
                  <span>+$10</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t pt-2">
                  <span>Final Rate</span>
                  <span>$145</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                AI adjusted price based on &quot;Local Tech Conference&quot; demand signals.
              </p>
            </div>

            <Button className="w-full" variant="outline">Edit Availability</Button>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}