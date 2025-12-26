"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Wrench,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  Loader2,
  Flame,
  Shield,
  Home,
  Sparkles,
  Wind
} from "lucide-react"

interface Listing {
  id: string
  title: string
}

interface MaintenanceLog {
  id: string
  action: string
  notes?: string
  cost?: number
  performedBy?: string
  performedAt: string
}

interface MaintenanceItem {
  id: string
  name: string
  category: string
  location?: string
  quantity: number
  notes?: string
  lastServiceDate?: string
  nextServiceDate?: string
  intervalDays?: number
  status: string
  listing: { id: string; title: string }
  logs: MaintenanceLog[]
}

interface Template {
  name: string
  category: string
  intervalDays: number
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  hvac: Wind,
  safety: Shield,
  appliance: Home,
  cleaning: Sparkles,
  exterior: Home,
}

const CATEGORY_LABELS: Record<string, string> = {
  hvac: "HVAC",
  safety: "Safety",
  appliance: "Appliance",
  cleaning: "Cleaning",
  exterior: "Exterior",
}

function getStatusBadge(status: string) {
  switch (status) {
    case "overdue":
      return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" /> Overdue</Badge>
    case "due_soon":
      return <Badge className="bg-amber-500"><Clock className="h-3 w-3 mr-1" /> Due Soon</Badge>
    case "good":
      return <Badge className="bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" /> Good</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function formatDate(dateString?: string) {
  if (!dateString) return "Never"
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function MaintenancePage() {
  const [items, setItems] = useState<MaintenanceItem[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedListing, setSelectedListing] = useState<string>("all")

  // Add item dialog
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newItem, setNewItem] = useState({
    listingId: "",
    name: "",
    category: "",
    location: "",
    quantity: 1,
    notes: "",
    intervalDays: 90,
    lastServiceDate: "",
  })
  const [isAdding, setIsAdding] = useState(false)

  // Log maintenance dialog
  const [showLogDialog, setShowLogDialog] = useState(false)
  const [logItem, setLogItem] = useState<MaintenanceItem | null>(null)
  const [logData, setLogData] = useState({
    action: "replaced",
    notes: "",
    cost: "",
    performedBy: "",
  })
  const [isLogging, setIsLogging] = useState(false)

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const url = selectedListing === "all"
        ? "/api/maintenance"
        : `/api/maintenance?listingId=${selectedListing}`
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setItems(data.items || [])
        setListings(data.listings || [])
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error("Failed to fetch maintenance data", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [selectedListing])

  const handleAddItem = async () => {
    if (!newItem.listingId || !newItem.name || !newItem.category) return
    setIsAdding(true)
    try {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      })
      if (res.ok) {
        setShowAddDialog(false)
        setNewItem({
          listingId: "",
          name: "",
          category: "",
          location: "",
          quantity: 1,
          notes: "",
          intervalDays: 90,
          lastServiceDate: "",
        })
        fetchData()
      }
    } catch (error) {
      console.error("Failed to add item", error)
    } finally {
      setIsAdding(false)
    }
  }

  const handleLogMaintenance = async () => {
    if (!logItem) return
    setIsLogging(true)
    try {
      const res = await fetch("/api/maintenance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: logItem.id,
          action: logData.action,
          notes: logData.notes || undefined,
          cost: logData.cost ? parseFloat(logData.cost) : undefined,
          performedBy: logData.performedBy || undefined,
        }),
      })
      if (res.ok) {
        setShowLogDialog(false)
        setLogItem(null)
        setLogData({ action: "replaced", notes: "", cost: "", performedBy: "" })
        fetchData()
      }
    } catch (error) {
      console.error("Failed to log maintenance", error)
    } finally {
      setIsLogging(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/maintenance?itemId=${deleteId}`, { method: "DELETE" })
      if (res.ok) {
        setItems(items.filter((i) => i.id !== deleteId))
      }
    } catch (error) {
      console.error("Failed to delete item", error)
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const applyTemplate = (template: Template) => {
    setNewItem({
      ...newItem,
      name: template.name,
      category: template.category,
      intervalDays: template.intervalDays,
    })
  }

  const overdueCount = items.filter((i) => i.status === "overdue").length
  const dueSoonCount = items.filter((i) => i.status === "due_soon").length
  const goodCount = items.filter((i) => i.status === "good").length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Maintenance Tracker</h1>
          <p className="text-sm text-muted-foreground">
            Track maintenance schedules for your rental properties.
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedListing} onValueChange={setSelectedListing}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Properties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {listings.map((listing) => (
                <SelectItem key={listing.id} value={listing.id}>
                  {listing.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Add Item</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Maintenance Item</DialogTitle>
                <DialogDescription>
                  Track a new maintenance item for your property.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {templates.length > 0 && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Quick Add</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {templates.slice(0, 6).map((t) => (
                        <Button
                          key={t.name}
                          variant="outline"
                          size="sm"
                          onClick={() => applyTemplate(t)}
                        >
                          {t.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid gap-2">
                  <Label>Property *</Label>
                  <Select
                    value={newItem.listingId}
                    onValueChange={(v) => setNewItem({ ...newItem, listingId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property" />
                    </SelectTrigger>
                    <SelectContent>
                      {listings.map((listing) => (
                        <SelectItem key={listing.id} value={listing.id}>
                          {listing.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Item Name *</Label>
                    <Input
                      placeholder="e.g., HVAC Filter"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Category *</Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(v) => setNewItem({ ...newItem, category: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hvac">HVAC</SelectItem>
                        <SelectItem value="safety">Safety</SelectItem>
                        <SelectItem value="appliance">Appliance</SelectItem>
                        <SelectItem value="cleaning">Cleaning</SelectItem>
                        <SelectItem value="exterior">Exterior</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Location</Label>
                    <Input
                      placeholder="e.g., All Bedrooms"
                      value={newItem.location}
                      onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min={1}
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Service Interval (days)</Label>
                    <Input
                      type="number"
                      min={1}
                      value={newItem.intervalDays}
                      onChange={(e) => setNewItem({ ...newItem, intervalDays: parseInt(e.target.value) || 90 })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Last Service Date</Label>
                    <Input
                      type="date"
                      value={newItem.lastServiceDate}
                      onChange={(e) => setNewItem({ ...newItem, lastServiceDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Any additional notes..."
                    value={newItem.notes}
                    onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                <Button onClick={handleAddItem} disabled={isAdding || !newItem.listingId || !newItem.name || !newItem.category}>
                  {isAdding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Add Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className={overdueCount > 0 ? "bg-red-50 border-red-200" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{overdueCount}</div>
            <p className="text-xs text-red-600/80">Needs immediate attention</p>
          </CardContent>
        </Card>
        <Card className={dueSoonCount > 0 ? "bg-amber-50 border-amber-200" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Due Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">{dueSoonCount}</div>
            <p className="text-xs text-amber-600/80">Within next 2 weeks</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Up to Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{goodCount}</div>
            <p className="text-xs text-green-600/80">All good</p>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Items List */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Items</CardTitle>
          <CardDescription>
            {items.length} item{items.length !== 1 ? "s" : ""} tracked
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Wrench className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No maintenance items tracked yet.</p>
              <p className="text-sm">Click "Add Item" to start tracking.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const Icon = CATEGORY_ICONS[item.category] || Wrench
                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{item.name}</h3>
                          {item.quantity > 1 && (
                            <Badge variant="outline">x{item.quantity}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.listing.title}
                          {item.location && ` • ${item.location}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-1">
                      {getStatusBadge(item.status)}
                      <p className="text-xs text-muted-foreground">
                        Last: {formatDate(item.lastServiceDate)}
                      </p>
                      {item.nextServiceDate && (
                        <p className="text-xs text-muted-foreground">
                          Next: {formatDate(item.nextServiceDate)}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setLogItem(item)
                          setShowLogDialog(true)
                        }}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Log Service
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive"
                        onClick={() => setDeleteId(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log Maintenance Dialog */}
      <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Maintenance</DialogTitle>
            <DialogDescription>
              Record maintenance performed on {logItem?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Action Performed</Label>
              <Select
                value={logData.action}
                onValueChange={(v) => setLogData({ ...logData, action: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="replaced">Replaced</SelectItem>
                  <SelectItem value="inspected">Inspected</SelectItem>
                  <SelectItem value="repaired">Repaired</SelectItem>
                  <SelectItem value="cleaned">Cleaned</SelectItem>
                  <SelectItem value="serviced">Serviced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Cost ($)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={logData.cost}
                  onChange={(e) => setLogData({ ...logData, cost: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Performed By</Label>
                <Input
                  placeholder="Self, Company name..."
                  value={logData.performedBy}
                  onChange={(e) => setLogData({ ...logData, performedBy: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Any notes about the service..."
                value={logData.notes}
                onChange={(e) => setLogData({ ...logData, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogDialog(false)}>Cancel</Button>
            <Button onClick={handleLogMaintenance} disabled={isLogging}>
              {isLogging ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Maintenance Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This will also delete all service history for this item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
