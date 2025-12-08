import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Zap, AlertTriangle, CheckCircle2 } from "lucide-react"

export default function ListingsPage() {
  const listings = [
    {
      id: "1",
      name: "The Quiet Loft",
      location: "San Francisco, CA",
      status: "Active",
      smartPricing: true,
      health: "Good",
      nextGuest: "Oct 14",
      price: "$145"
    },
    {
      id: "2",
      name: "Sunny Mission Condo",
      location: "San Francisco, CA",
      status: "Active",
      smartPricing: true,
      health: "Warning",
      nextGuest: "Oct 20",
      price: "$210"
    },
    {
      id: "3",
      name: "Ocean Beach Cottage",
      location: "Pacifica, CA",
      status: "Maintenance",
      smartPricing: false,
      health: "Critical",
      nextGuest: "Blocked",
      price: "$95"
    }
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Your Properties</h1>
          <p className="text-sm text-muted-foreground">Manage pricing, availability, and AI settings.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>

      <div className="rounded-md border shadow-sm bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Property</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Smart Pricing</TableHead>
              <TableHead>Health Score</TableHead>
              <TableHead>Next Guest</TableHead>
              <TableHead className="text-right">Base Price</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="font-semibold">{listing.name}</span>
                    <span className="text-xs text-muted-foreground">{listing.location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={listing.status === "Active" ? "default" : "secondary"}
                    className={listing.status === "Maintenance" ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : ""}
                  >
                    {listing.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {listing.smartPricing ? (
                    <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                      <Zap className="h-3 w-3 fill-green-600" />
                      Active
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Manual</span>
                  )}
                </TableCell>
                <TableCell>
                  {listing.health === "Good" && (
                     <div className="flex items-center gap-1 text-sm">
                       <CheckCircle2 className="h-4 w-4 text-green-500" />
                       <span className="text-muted-foreground">100%</span>
                     </div>
                  )}
                  {listing.health === "Warning" && (
                     <div className="flex items-center gap-1 text-sm">
                       <AlertTriangle className="h-4 w-4 text-amber-500" />
                       <span className="text-muted-foreground">Attention Needed</span>
                     </div>
                  )}
                  {listing.health === "Critical" && (
                     <div className="flex items-center gap-1 text-sm">
                       <AlertTriangle className="h-4 w-4 text-red-500" />
                       <span className="font-medium text-red-600">Issue Detected</span>
                     </div>
                  )}
                </TableCell>
                <TableCell className="text-sm">{listing.nextGuest}</TableCell>
                <TableCell className="text-right">{listing.price}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Dashboard</DropdownMenuItem>
                      <DropdownMenuItem>Edit Listing</DropdownMenuItem>
                      <DropdownMenuItem>Pricing Settings</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}