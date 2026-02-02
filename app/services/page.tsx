import { Metadata } from "next"
import Link from "next/link"
import { 
  ArrowRight, 
  Check, 
  Code2, 
  Database, 
  Globe, 
  Laptop, 
  MessageSquare, 
  Palette, 
  Rocket, 
  Server, 
  Smartphone, 
  Wrench 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Services | Kisibo Jonathan",
  description: "Professional web development, mobile app development, and software consulting services.",
}

const services = [
  {
    icon: Globe,
    title: "Web Development",
    description: "Custom web applications built with modern technologies. From simple landing pages to complex web apps.",
    features: [
      "Responsive design",
      "SEO optimization",
      "Performance tuning",
      "CMS integration",
      "E-commerce solutions",
    ],
    price: "From $208.43",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications that provide seamless user experiences.",
    features: [
      "iOS & Android",
      "Cross-platform (React Native)",
      "App Store deployment",
      "Push notifications",
      "Offline functionality",
    ],
    price: "From $1500",
  },
  {
    icon: Server,
    title: "Backend Development",
    description: "Scalable server solutions, APIs, and database design for your applications.",
    features: [
      "RESTful & GraphQL APIs",
      "Database design",
      "Authentication systems",
      "Cloud deployment",
      "Third-party integrations",
    ],
    price: "From $600",
  },
]

const managementSystems = [
  {
    icon: Laptop,
    title: "Sales Management System",
    description: "Comprehensive solution for managing sales pipelines, customer relationships, and revenue tracking.",
    features: [
      "Sales pipeline tracking",
      "Customer relationship management",
      "Deal management",
      "Sales analytics & reporting",
      "Quote & invoice generation",
    ],
    price: "From $1200",
  },
  {
    icon: Database,
    title: "Business Management System",
    description: "All-in-one platform for managing operations, finances, and business processes.",
    features: [
      "Financial management",
      "Expense tracking",
      "Workflow automation",
      "Multi-department integration",
      "Real-time dashboards",
    ],
    price: "From $1400",
  },
  {
    icon: Wrench,
    title: "Inventory Management Systems",
    description: "Real-time inventory tracking and supply chain management solutions.",
    features: [
      "Stock tracking",
      "Supplier management",
      "Automated alerts",
      "Analytics & reporting",
      "Barcode integration",
    ],
    price: "From $950",
  },
]

const additionalServices = [
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "User-centered design that looks great and works even better.",
  },
  {
    icon: Database,
    title: "Database Consulting",
    description: "Optimize your data architecture for performance and scalability.",
  },
  {
    icon: Wrench,
    title: "Maintenance & Support",
    description: "Ongoing support to keep your applications running smoothly.",
  },
  {
    icon: Rocket,
    title: "Search Engine Optimization",
    description: "Improve your online visibility and drive organic traffic to your site.",
  },
  {
    icon: Code2,
    title: "Code Review",
    description: "Expert review of your codebase with actionable recommendations.",
  },
  {
    icon: MessageSquare,
    title: "Technical Consulting",
    description: "Strategic advice on technology choices and architecture decisions.",
  },
]

const process = [
  {
    step: "01",
    title: "Discovery",
    description: "We discuss your project requirements, goals, and timeline to ensure we're aligned.",
  },
  {
    step: "02",
    title: "Planning",
    description: "I create a detailed project plan with milestones, deliverables, and clear expectations.",
  },
  {
    step: "03",
    title: "Development",
    description: "Building your solution with regular updates and opportunities for feedback.",
  },
  {
    step: "04",
    title: "Launch & Support",
    description: "Deploying your project and providing ongoing support to ensure success.",
  },
]

export default function ServicesPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Page Header */}
        <div className="mb-16 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-accent">
            Services
          </p>
          <h1 className="mt-2 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            How I Can Help
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            From concept to deployment, I offer end-to-end development services 
            to bring your digital ideas to life.
          </p>
        </div>

        {/* Main Services */}
        <div className="mb-24 grid gap-8 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title} className="flex flex-col border-border/50 transition-all hover:border-accent/30 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 inline-flex w-fit rounded-lg bg-accent/10 p-3 text-accent">
                  <service.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4 border-t border-border/50 pt-6">
                <p className="text-2xl font-bold text-foreground">{service.price}</p>
                <Button asChild className="w-full gap-2">
                  <Link href="/contact">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Management Systems */}
        <div className="mb-24 grid gap-8 lg:grid-cols-3">
          {managementSystems.map((system) => (
            <Card key={system.title} className="flex flex-col border-border/50 transition-all hover:border-accent/30 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 inline-flex w-fit rounded-lg bg-accent/10 p-3 text-accent">
                  <system.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{system.title}</CardTitle>
                <CardDescription>{system.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {system.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4 border-t border-border/50 pt-6">
                <p className="text-2xl font-bold text-foreground">{system.price}</p>
                <Button asChild className="w-full gap-2">
                  <Link href="/contact">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Additional Services */}
        <section className="mb-24">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Additional Services
            </h2>
            <p className="mt-4 text-muted-foreground">
              More ways I can support your project.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {additionalServices.map((service) => (
              <div
                key={service.title}
                className="flex items-start gap-4 rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-accent/30"
              >
                <div className="rounded-lg bg-accent/10 p-2 text-accent">
                  <service.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{service.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Process Section */}
        <section className="mb-24">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              My Process
            </h2>
            <p className="mt-4 text-muted-foreground">
              A transparent, collaborative approach to every project.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {process.map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-2xl font-bold text-accent">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-primary p-8 text-center text-primary-foreground sm:p-12">
          <h2 className="text-3xl font-bold">Ready to Start Your Project?</h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            {"Let's"} discuss your requirements and create something amazing together.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8 gap-2">
            <Link href="/contact">
              Schedule a Call
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </section>
      </div>
    </div>
  )
}
