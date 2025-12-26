import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { HostAnalytics } from "@/components/host-analytics"

export default async function AnalyticsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return <HostAnalytics />
}
