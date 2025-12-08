import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Wrench, 
  Thermometer, 
  Droplets, 
  Wifi, 
  Battery, 
  CheckCircle2, 
  AlertTriangle,
  History
} from "lucide-react"

export default function MaintenancePage() {
  return (
    <div className="flex flex-col gap-6">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-semibold md:text-2xl">Predictive Maintenance</h1>
        <p className="text-sm text-muted-foreground">
          AI monitors your property sensors to prevent downtime and protect asset value.
        </p>
      </div>

      {/* --- OVERVIEW CARDS --- */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">92%</div>
            <p className="text-xs text-green-600/80">Optimal Performance</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-400">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">2</div>
            <p className="text-xs text-amber-600/80">Requires Attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Est. Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,250</div>
            <p className="text-xs text-muted-foreground">This Year (via prevention)</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sensors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sensors">Sensor Status</TabsTrigger>
          <TabsTrigger value="schedule">Maintenance Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sensors" className="space-y-4">
          
          {/* CRITICAL ALERT CARD */}
          <Card className="border-amber-200 dark:border-amber-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <CardTitle>AI Prediction: HVAC Anomaly</CardTitle>
              </div>
              <CardDescription>
                Detected at "Sunny Mission Condo" • High Confidence (85%)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Our model detected irregular cycling patterns in the AC unit. This pattern typically precedes a compressor failure by 14 days.
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="default">Contact Technician</Button>
                    <Button size="sm" variant="outline">Ignore (Teach AI)</Button>
                  </div>
                </div>
                <div className="rounded-md border p-4 bg-background">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>Compressor Efficiency</span>
                    <span className="text-amber-500 font-bold">Low</span>
                  </div>
                  <Progress value={45} className="h-2 bg-slate-100 [&>div]:bg-amber-500" />
                  <div className="mt-4 mb-2 flex items-center justify-between text-sm">
                    <span>Airflow Output</span>
                    <span className="text-green-500 font-bold">Normal</span>
                  </div>
                  <Progress value={90} className="h-2 bg-slate-100 [&>div]:bg-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SENSOR GRID */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                <Thermometer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">72°F</div>
                <p className="text-xs text-muted-foreground">All rooms stable</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Water Leak</CardTitle>
                <Droplets className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="font-bold">None</span>
                </div>
                <p className="text-xs text-muted-foreground">Last check: 2m ago</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">WiFi Status</CardTitle>
                <Wifi className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">420 Mbps</div>
                <p className="text-xs text-muted-foreground">Connection stable</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Smart Locks</CardTitle>
                <Battery className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">88%</div>
                <p className="text-xs text-muted-foreground">Battery level</p>
              </CardContent>
            </Card>
          </div>

        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>
                Automated schedule based on usage and manufacturer guidelines.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex items-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted">
                    <Wrench className="h-4 w-4" />
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Filter Replacement</p>
                    <p className="text-sm text-muted-foreground">Due in 5 days</p>
                  </div>
                  <div className="ml-auto font-medium">The Quiet Loft</div>
                </div>
                <div className="flex items-center">
                   <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted">
                    <History className="h-4 w-4" />
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Deep Clean</p>
                    <p className="text-sm text-muted-foreground">Scheduled for Oct 22</p>
                  </div>
                  <div className="ml-auto font-medium">Sunny Mission Condo</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}