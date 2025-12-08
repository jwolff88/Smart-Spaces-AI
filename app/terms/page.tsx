import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-12">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4 pl-0 hover:bg-transparent hover:text-primary">
          <Link href="/get-started">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign Up
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mt-2">Last Updated: October 2024</p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using Smart Spaces AI ("the Platform"), you agree to be bound by these Terms of Service. 
            If you disagree with any part of the terms, you may not access the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. AI-Driven Services</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our platform utilizes Artificial Intelligence (AI) to provide pricing recommendations, maintenance predictions, and property matches. 
            While we strive for accuracy, AI predictions are estimates based on available data and should not be treated as guaranteed outcomes. 
            Hosts are responsible for verifying final pricing and maintenance decisions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
          <p className="text-muted-foreground leading-relaxed">
            When you create an account with us, you must provide accurate, complete, and current information. 
            Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Host Responsibilities</h2>
          <p className="text-muted-foreground leading-relaxed">
            Hosts are solely responsible for setting their listing availability, honoring bookings, and maintaining the safety of their properties. 
            Smart Spaces AI acts as an infrastructure layer and is not a party to the rental agreement between Host and Guest.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Termination</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, 
            including without limitation if you breach the Terms.
          </p>
        </section>
      </div>
    </div>
  )
}