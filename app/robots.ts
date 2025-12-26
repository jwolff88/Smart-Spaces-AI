import { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://smart-spaces-ai.vercel.app"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/host-dashboard",
          "/guest-dashboard",
          "/messages",
          "/settings",
          "/onboarding",
          "/booking/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
