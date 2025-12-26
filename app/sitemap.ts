import { MetadataRoute } from "next"
import { db } from "@/lib/db"

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://smart-spaces-ai.vercel.app"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all active listings for dynamic routes
  const listings = await db.listing.findMany({
    where: { status: "active" },
    select: { id: true, updatedAt: true },
  })

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/features`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  // Dynamic listing pages
  const listingPages: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${siteUrl}/listings/${listing.id}`,
    lastModified: listing.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [...staticPages, ...listingPages]
}
