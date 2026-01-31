import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Code2, Coffee, Globe, Heart, Lightbulb, MapPin, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About | Your Name",
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
    year: "2024 - Present",
    title: "Senior Full-Stack Developer",
    company: "Tech Company",
    description: "Leading development of enterprise applications, mentoring junior developers, and driving technical decisions.",
  },
  {
    year: "2022 - 2024",
    title: "Full-Stack Developer",
    company: "Digital Agency",
    description: "Built custom web applications and mobile apps for various clients across different industries.",
  },
  {
    year: "2020 - 2022",
    title: "Junior Developer",
    company: "Startup Inc.",
    description: "Started my professional journey building features for a SaaS product and learning from experienced developers.",
  },
  {
    year: "2020",
    title: "Bachelor's in IT",
    company: "University",
    description: "Graduated with honors, specializing in web development and software engineering.",
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
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <span>Your Photo</span>
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
              Hey, {"I'm"} Your Name
            </h1>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                {"I'm"} a full-stack developer with a passion for creating digital experiences 
                that make a difference. With over 5 years of experience in the industry, 
                {"I've"} had the opportunity to work on diverse projects ranging from 
                startups to enterprise applications.
              </p>
              <p>
                My journey into tech started with a curiosity about how things work on the 
                web. That curiosity has evolved into a career where I get to solve complex 
                problems and build products that help businesses grow.
              </p>
              <p>
                When {"I'm"} not coding, you can find me exploring new technologies, 
                contributing to open source, or enjoying a good cup of coffee while 
                reading about the latest in tech.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-accent" />
                <span>Open to Remote</span>
              </div>
              <div className="flex items-center gap-2">
                <Coffee className="h-4 w-4 text-accent" />
                <span>Coffee Enthusiast</span>
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
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              What Drives Me
            </h2>
            <p className="mt-4 text-muted-foreground">
              Core values that guide my work and collaboration.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border border-border/50 bg-card p-6 text-center transition-all hover:border-accent/30 hover:shadow-lg"
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
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              My Journey
            </h2>
            <p className="mt-4 text-muted-foreground">
              A timeline of my professional experience and education.
            </p>
          </div>

          <div className="relative mx-auto max-w-3xl">
            {/* Timeline Line */}
            <div className="absolute left-0 top-0 h-full w-px bg-border md:left-1/2" />

            {timeline.map((item, index) => (
              <div
                key={item.year}
                className={`relative mb-8 flex flex-col md:flex-row ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
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
