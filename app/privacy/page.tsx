import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-12">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4 pl-0 hover:bg-transparent hover:text-primary">
          <Link href="/get-started">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign Up
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mt-2">Last Updated: October 2024</p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
          <p className="text-muted-foreground leading-relaxed">
            To provide our AI-driven services, we collect:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
            <li><strong>Personal Identity:</strong> Name, email, and contact details.</li>
            <li><strong>Usage Data:</strong> Search history, property views, and booking patterns.</li>
            <li><strong>Property Data (Hosts):</strong> Address, amenities, photos, and sensor data (if using predictive maintenance tools).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use your data to power the Smart Spaces infrastructure:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
            <li><strong>Matching Engine:</strong> To personalize search results based on your intent (e.g., &quot;Remote Work&quot;).</li>
            <li><strong>Dynamic Pricing:</strong> To analyze market demand and suggest optimal rates.</li>
            <li><strong>Predictive Maintenance:</strong> To analyze sensor data and predict equipment failures before they occur.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. AI & Automated Decision Making</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our platform uses machine learning algorithms to make recommendations. While we aim for accuracy, these automated decisions (such as pricing suggestions) are advisory. You have the right to opt-out of certain automated processing in your Settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Data Sharing</h2>
          <p className="text-muted-foreground leading-relaxed">
            We do not sell your personal data to third parties. We may share data with service providers (e.g., payment processors, cloud hosting) strictly for the purpose of operating the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have questions about your data, please contact us at privacy@smartspaces.ai.
          </p>
        </section>
      </div>
    </div>
  )
}