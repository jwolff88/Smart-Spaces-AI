import { Suspense } from "react"

// Force dynamic rendering for onboarding page
export const dynamic = 'force-dynamic'

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <div className="text-white text-lg">Loading...</div>
    </div>
  )
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
}
