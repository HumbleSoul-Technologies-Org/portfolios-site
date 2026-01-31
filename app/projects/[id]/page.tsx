import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Clock, ExternalLink, Github, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { projects } from "@/lib/projects-data"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const project = projects.find((p) => p.id === id)
  
  if (!project) {
    return { title: "Project Not Found" }
  }

  return {
    title: `${project.title} | Your Name`,
    description: project.description,
  }
}

export function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }))
}

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params
  const project = projects.find((p) => p.id === id)

  if (!project) {
    notFound()
  }

  return (
    <div className="py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Back Link */}
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="mb-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {project.longDescription}
          </p>

          {/* Meta Info */}
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
            {project.client && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{project.client}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{project.year}</span>
            </div>
            {project.duration && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{project.duration}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            {project.liveUrl && (
              <Button asChild className="gap-2">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  View Live Site
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button asChild variant="outline" className="gap-2 bg-transparent">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  View Source
                </a>
              </Button>
            )}
          </div>
        </header>

        {/* Project Image */}
        <div className="relative mb-12 aspect-video overflow-hidden rounded-xl border border-border bg-muted">
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Case Study Content */}
        <div className="space-y-12">
          {/* Challenge */}
          {project.challenge && (
            <section>
              <h2 className="mb-4 text-2xl font-bold text-foreground">The Challenge</h2>
              <p className="text-muted-foreground">{project.challenge}</p>
            </section>
          )}

          {/* Solution */}
          {project.solution && (
            <section>
              <h2 className="mb-4 text-2xl font-bold text-foreground">The Solution</h2>
              <p className="text-muted-foreground">{project.solution}</p>
            </section>
          )}

          {/* Results */}
          {project.results && project.results.length > 0 && (
            <section>
              <h2 className="mb-4 text-2xl font-bold text-foreground">Results</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {project.results.map((result, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-border/50 bg-card p-4"
                  >
                    <p className="font-medium text-foreground">{result}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Testimonial */}
          {project.testimonial && (
            <section className="rounded-xl border border-accent/30 bg-accent/5 p-8">
              <blockquote className="text-lg italic text-foreground">
                {'"'}{project.testimonial.quote}{'"'}
              </blockquote>
              <div className="mt-4">
                <p className="font-semibold text-foreground">
                  {project.testimonial.author}
                </p>
                <p className="text-sm text-muted-foreground">
                  {project.testimonial.role}
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-16 border-t border-border pt-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-accent hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            View All Projects
          </Link>
        </div>
      </div>
    </div>
  )
}
