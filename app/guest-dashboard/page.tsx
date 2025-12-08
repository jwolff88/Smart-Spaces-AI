"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, Heart, Settings, Bell, CreditCard, User, Plane, Home, TrendingUp } from "lucide-react"

export default function GuestDashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <Home className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold">Anacra</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>GU</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-white min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            <Button variant="default" className="w-full justify-start gap-2">
              <Search className="h-4 w-4" />
              Discover
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Calendar className="h-4 w-4" />
              My Trips
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Heart className="h-4 w-4" />
              Wishlist
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <User className="h-4 w-4" />
              Profile
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Methods
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Welcome back!</h2>
                <p className="text-muted-foreground">Ready for your next adventure?</p>
              </div>
              <Button className="gap-2">
                <Plane className="h-4 w-4" />
                Plan a Trip
              </Button>
            </div>

            {/* Search Bar */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Where would you like to go?"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Calendar className="h-4 w-4" />
                    Dates
                  </Button>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <User className="h-4 w-4" />
                    Guests
                  </Button>
                  <Button>Search</Button>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="discover" className="space-y-6">
              <TabsList>
                <TabsTrigger value="discover">Discover</TabsTrigger>
                <TabsTrigger value="trips">My Trips</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
              </TabsList>

              <TabsContent value="discover" className="space-y-6">
                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">0</div>
                      <p className="text-sm text-muted-foreground">Properties Available</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">0</div>
                      <p className="text-sm text-muted-foreground">Cities to Explore</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">0</div>
                      <p className="text-sm text-muted-foreground">Special Offers</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Featured Properties */}
                <Card>
                  <CardHeader>
                    <CardTitle>Featured Properties</CardTitle>
                    <CardDescription>Discover amazing places to stay</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No properties available yet</p>
                      <p className="text-sm text-muted-foreground mt-1">Check back soon for amazing places to stay</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trips" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Trips</CardTitle>
                    <CardDescription>Your upcoming and past bookings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No trips booked yet</p>
                      <p className="text-sm text-muted-foreground mt-1">Start planning your next adventure!</p>
                      <Button className="mt-4 gap-2">
                        <Search className="h-4 w-4" />
                        Browse Properties
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="wishlist" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Wishlist</CardTitle>
                    <CardDescription>Properties you've saved for later</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Your wishlist is empty</p>
                      <p className="text-sm text-muted-foreground mt-1">Save properties you love to view them later</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>AI-Powered Recommendations</CardTitle>
                    <CardDescription>Personalized suggestions based on your preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No recommendations available yet</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Complete your profile to get personalized suggestions
                      </p>
                      <Button className="mt-4 gap-2">
                        <User className="h-4 w-4" />
                        Complete Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
