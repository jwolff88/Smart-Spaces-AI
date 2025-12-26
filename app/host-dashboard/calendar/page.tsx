import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { CalendarClient } from "./calendar-client"

export default async function CalendarPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Fetch host's listings
  const listings = await db.listing.findMany({
    where: { hostId: session.user.id },
    select: {
      id: true,
      title: true,
      location: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return <CalendarClient listings={listings} />
}
