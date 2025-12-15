import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  MapPin, 
  Sparkles, 
  Bell, 
  ArrowRight, 
  CreditCard,
  MessageSquare,
  LogOut
} from "lucide-react"

export default function GuestDashboard() {
  return (
    <div className="min-h-screen bg-muted/40">
      
      {/* --- TOP NAVIGATION --- */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="hidden sm:inline">Smart Spaces AI</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 text-sm font-medium">
          <Link href="/recommendations" className="text-muted-foreground hover:text-foreground">
            Explore
          </Link>
          <Link href="#" className="text-primary font-semibold">
            Trips
          </Link>
          <Link href="/settings" className="text-muted-foreground hover:text-foreground">
            Settings
          </Link>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <LogOut className="h-4 w-4" />
          </Button>
        </nav>
      </header>

      <main className="container grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-8 md:gap-8">
        
        {/* --- WELCOME & ALERTS --- */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back, Alex!</h1>
            <p className="text-muted-foreground">
              Your trip to San Francisco is coming up in 14 days.
            </p>
          </div>
          
          {/* AI NOTIFICATION CARD */}
          <Card className="bg-primary/5 border-primary/20 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <CardTitle className="text-sm font-medium">AI Smart Alert</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Price Drop Alert: The &quot;Ocean View Loft&quot; you saved has dropped by 15% for your selected dates.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="ghost" className="w-full text-primary hover:text-primary hover:bg-primary/10">
                View Deal <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="upcoming" className="grid gap-4">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>
          </div>
          
          {/* --- UPCOMING TRIPS --- */}
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Trips</CardTitle>
                <CardDescription>
                  Manage your bookings and view check-in details.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                
                {/* Trip Item 1 */}
                <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
                  <div className="h-24 w-24 rounded-md bg-slate-200 sm:h-20 sm:w-20" /> {/* Image Placeholder */}
                  <div className="grid gap-1">
                    <h3 className="font-semibold">The Quiet Loft | Dedicated Workspace</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      San Francisco, CA
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Oct 14 - Oct 19 (5 nights)
                    </div>
                  </div>
                  <div className="ml-auto flex flex-col gap-2 sm:items-end">
                    <Badge className="bg-green-600">Confirmed</Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="mr-2 h-3 w-3" /> Message Host
                      </Button>
                      <Button size="sm">View Itinerary</Button>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          {/* --- PAST TRIPS --- */}
          <TabsContent value="past">
            <Card>
              <CardHeader>
                <CardTitle>Past Stays</CardTitle>
                <CardDescription>
                  View receipts and rate your experience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <p>No past trips found.</p>
                  <Button variant="link" className="mt-2">Start exploring</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

           {/* --- SAVED HOMES --- */}
           <TabsContent value="saved">
             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
               <Card>
                 <div className="h-32 w-full bg-slate-200 rounded-t-lg" />
                 <CardHeader className="pb-2">
                   <div className="flex justify-between">
                     <CardTitle className="text-base">Ocean View Loft</CardTitle>
                     <Badge variant="secondary" className="text-green-600 bg-green-50">Deal</Badge>
                   </div>
                   <CardDescription>Pacifica, CA</CardDescription>
                 </CardHeader>
                 <CardFooter>
                   <Button className="w-full" variant="outline">View Property</Button>
                 </CardFooter>
               </Card>
             </div>
           </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}