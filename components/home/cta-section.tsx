import { ArrowRight, Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="bg-primary py-24 text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <h2 className="max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to bring your next project to life?
          </h2>
          <p className="mt-4 max-w-xl text-primary-foreground/80">
            {"I'm"} always excited to work on new challenges. Whether you need a complete product build or help with a specific feature, {"let's"} talk.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button 
              asChild 
              size="lg" 
              variant="secondary"
              className="gap-2"
            >
              <Link href="/contact">
                <Mail className="h-4 w-4" />
                Get in Touch
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline"
              className="gap-2 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground bg-transparent"
            >
              <Link href="/services">
                View Services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
