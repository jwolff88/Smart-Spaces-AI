import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Shield, User, Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { auth } from "@/auth"

export default async function SettingsPage() {
  const session = await auth()
  const userName = session?.user?.name || ""
  const userEmail = session?.user?.email || ""
  return (
    <div className="container max-w-4xl py-10">
      
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9 border border-input shadow-sm">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile, security, and AI automation preferences.
          </p>
        </div>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList>
          <TabsTrigger value="account">
            <User className="mr-2 h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="ai-automation">
            <Sparkles className="mr-2 h-4 w-4" />
            AI & Automation
          </TabsTrigger>
        </TabsList>

        {/* --- ACCOUNT TAB --- */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal details and public profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" defaultValue={userName} placeholder="Your name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={userEmail} placeholder="your@email.com" readOnly className="bg-muted" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" placeholder="Tell hosts a bit about yourself..." />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* --- NOTIFICATIONS TAB --- */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be alerted about trips and alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label>Booking Updates</Label>
                  <span className="text-sm text-muted-foreground">Receive updates on check-in, checkout, and messages.</span>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label>Price Drop Alerts</Label>
                  <span className="text-sm text-muted-foreground">Get notified when saved properties drop in price.</span>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label>Marketing Emails</Label>
                  <span className="text-sm text-muted-foreground">Receive news about new features (we promise not to spam).</span>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- AI & AUTOMATION TAB (The "Smart" Features) --- */}
        <TabsContent value="ai-automation">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Smart Spaces Intelligence
              </CardTitle>
              <CardDescription>
                Configure how our AI acts on your behalf.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* For Travelers */}
              <div className="space-y-4">
                <h3 className="font-semibold">Traveler Intelligence</h3>
                <div className="flex items-center justify-between space-x-2 rounded-lg border bg-background p-4">
                  <div className="flex flex-col space-y-1">
                    <Label>Predictive Matching</Label>
                    <span className="text-xs text-muted-foreground">Allow AI to analyze your past trips to recommend better stays.</span>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              {/* For Hosts */}
              <div className="space-y-4">
                <h3 className="font-semibold">Host Automation</h3>
                <div className="flex items-center justify-between space-x-2 rounded-lg border bg-background p-4">
                  <div className="flex flex-col space-y-1">
                    <Label>Auto-Price Adjustments</Label>
                    <span className="text-xs text-muted-foreground">Allow AI to update nightly rates based on real-time demand (+/- 15%).</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-2 rounded-lg border bg-background p-4">
                  <div className="flex flex-col space-y-1">
                    <Label>Predictive Maintenance Alerts</Label>
                    <span className="text-xs text-muted-foreground">Receive alerts when sensors detect anomalies (leaks, HVAC efficiency).</span>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

            </CardContent>
            <CardFooter>
              <Button variant="default">Update Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}