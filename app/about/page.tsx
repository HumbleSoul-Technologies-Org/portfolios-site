import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Code2, Coffee, Gamepad, Gamepad2, Globe, Heart, Lightbulb, MapPin, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About | Kisibo Jonathan",
  description: "Learn more about my background, experience, and what drives me as a developer.",
}

const values = [
  {
    icon: Lightbulb,
    title: "Problem Solving",
    description: "I approach every challenge with curiosity and a systematic mindset to find elegant solutions.",
  },
  {
    icon: Heart,
    title: "User-Centric",
    description: "Building products that users love is at the core of everything I create.",
  },
  {
    icon: Rocket,
    title: "Continuous Learning",
    description: "Technology evolves rapidly, and I'm committed to staying at the forefront.",
  },
  {
    icon: Code2,
    title: "Clean Code",
    description: "Writing maintainable, well-documented code that teams can build upon.",
  },
]

const timeline = [
   
  {
    year: "2025",
    title: "Full-Stack Developer",
    company: "Hanli Company Uganda LTD",
    description: "Built custom responsive website for the company to enhance their online presence and customer engagement.",
  },
  {
    year: "2026",
    title: "Full-Stack Developer",
    company: "Business Acceleration Group (BAG)",
    description: "Built custom responsive website for the company to enhance their online presence and customer engagement.",
  },
  {
    year: "2026",
    title: "Full-Stack Developer",
    company: "AIO Solars LTD",
    description: "Built custom responsive website for the company to enhance their online presence and customer engagement.",
  },
   
]

export default function AboutPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero Section */}
        <div className="mb-24 grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Photo Placeholder */}
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
              <div className="flex w-auto h-full items-center justify-center text-muted-foreground">
                <img src="/profile-pic.jpg" className="w-full h-full object-contain" alt="Profile Photo" />
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl border-2 border-accent/30" />
          </div>

          {/* Bio */}
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-accent">
              About Me
            </p>
            <h1 className="mt-2 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Hey, {"I'm"}  Jonathan
            </h1>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                {"I'm"} a full-stack developer (MERN) with a passion for creating digital experiences 
                that make a difference. With over 3 years of experience in the industry, 
                {"I've"} had the opportunity to work on diverse projects ranging from 
                startups to enterprise applications.
              </p>
               
              <p>
                Besides developing websites, {"I'm"} a skilled IT techinicain with expertise in
               computer hardware and software installations and configurations, Linux, computer mantainance, network setup and configuration, and system maintenance. 
                This technical background enhances my ability to build robust and efficient applications and systems.
              </p>

              <p>
                 My good communication  and collaborative skills approach have allowed me to work effectively
                 with cross-functional teams, ensuring that projects are delivered on time and meet client expectations.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                <span>Kampala, Uganda</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-accent" />
                <span>Open to Project Collaborations</span>
              </div>
              <div className="flex items-center gap-2">
                <Gamepad2 className="h-4 w-4 text-accent" />
                <span>Gaming Enthusiast</span>
              </div>
            </div>

            <div className="mt-8">
              <Button asChild className="gap-2">
                <Link href="/contact">
                  Get in Touch
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <section className="mb-24">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground animate-fade-in">
              What Drives Me
            </h2>
            <p className="mt-4 text-muted-foreground animate-fade-in [animation-delay:100ms]">
              Core values that guide my work and collaboration.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, idx) => (
              <div
                key={value.title}
                className="rounded-xl border border-border/50 bg-card p-6 text-center transition-all hover:border-accent/30 hover:shadow-lg animate-fade-in"
                style={{ animationDelay: `${200 + idx * 75}ms` }}
              >
                <div className="mx-auto mb-4 inline-flex rounded-lg bg-accent/10 p-3 text-accent">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline Section */}
        <section>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground animate-fade-in">
              My Journey
            </h2>
            <p className="mt-4 text-muted-foreground animate-fade-in [animation-delay:100ms]">
              A timeline of my professional experience and education.
            </p>
          </div>

          <div className="relative mx-auto max-w-3xl">
            {/* Timeline Line */}
            <div className="absolute left-0 top-0 h-full w-px bg-border md:left-1/2" />

            {timeline.map((item, index) => (
              <div
                key={item.year}
                className={`relative mb-8 flex flex-col md:flex-row animate-fade-in ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
                style={{ animationDelay: `${200 + index * 100}ms` }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 top-0 h-3 w-3 -translate-x-1 rounded-full bg-accent md:left-1/2 md:-translate-x-1/2" />

                {/* Content */}
                <div className={`ml-8 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                  <div className="rounded-xl border border-border/50 bg-card p-6">
                    <span className="text-sm font-medium text-accent">
                      {item.year}
                    </span>
                    <h3 className="mt-1 text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.company}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
