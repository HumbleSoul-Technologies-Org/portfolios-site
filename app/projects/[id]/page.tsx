"use client"

import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Clock, ExternalLink, Github, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { projects, type Project } from "@/lib/projects-data"
import { useEffect, useState,use } from "react"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"

interface PageProps {
  params: Promise<{ id: string }>
}

 

export default function ProjectPage({ params }: PageProps) {
  const { id } = use(params)
  // Use React Query to fetch the project from the API
  const { data, isLoading, isError } = useQuery<any>({
    queryKey: ["projects",id],
  })

  const [project, setProject] = useState<Project | null>(null)

   

  // Normalize tag list (support `tags` or legacy `technologies` shape)
  const tagList: string[] = project?.tags ?? ((project as any)?.technologies ?? [])

  useEffect(() => { 
    if (data) {
      const newData:any = data?.data?.project
     
      setProject(newData)
    }
  }, [data, isLoading, isError])

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* Back Link Skeleton */}
          <Skeleton className="mb-8 h-6 w-32" />

          {/* Header Skeleton */}
          <div className="mb-12">
            {/* Tags Skeleton */}
            <div className="mb-4 flex flex-wrap gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            
            {/* Title Skeleton */}
            <Skeleton className="mb-4 h-12 w-full" />
            
            {/* Description Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // if (error || !project) {
  //   notFound()
  // }

  // If API errored and no static fallback, show user-friendly fallback section
  if (isError && !project) {
    return (
      <div className="py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-semibold mb-2">Unable to load project</h2>
          <p className="text-muted-foreground mb-6">We couldn't load this project right now. Try again or view other projects.</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/projects">
              <Button variant="outline">Back to Projects</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Back Link */}
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground animate-fade-in"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="mb-4 flex flex-wrap gap-2">
            {tagList.map((tag, idx) => (
              <Badge key={tag} variant="secondary" className="animate-fade-in" style={{ animationDelay: `${100 + idx * 50}ms` }}>
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl animate-fade-in [animation-delay:200ms]">
            {project?.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground animate-fade-in [animation-delay:300ms]">
            {project?.longDescription}
          </p>

          {/* Meta Info */}
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
            {project?.client && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{project?.client}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{project?.year}</span>
            </div>
            {project?.duration && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{project?.duration}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            {project?.liveUrl && (
              <Button asChild className="gap-2">
                <a href={project?.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  View Live Site
                </a>
              </Button>
            )}
            {project?.githubUrl && (
              <Button asChild variant="outline" className="gap-2 bg-transparent">
                <a href={project?.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  View Source
                </a>
              </Button>
            )}
          </div>
        </header>

        {/* Project Image */}
        <div className="relative mb-12 aspect-video overflow-hidden rounded-xl border border-border bg-muted">
          <img
            src={project?.image?.url || "/placeholder.svg"}
            className="object-cover h-full w-full"
          />
        </div>

        {/* Case Study Content */}
        <div className="space-y-12">
          {/* Challenge */}
          {project?.challenge && (
            <section>
              <h2 className="mb-4 text-2xl font-bold text-foreground">The Challenge</h2>
              <p className="text-muted-foreground">{project?.challenge}</p>
            </section>
          )}

          {/* Solution */}
          {project?.solution && (
            <section>
              <h2 className="mb-4 text-2xl font-bold text-foreground">The Solution</h2>
              <p className="text-muted-foreground">{project?.solution}</p>
            </section>
          )}

          {/* Results */}
          {project?.results && project?.results.length > 0 && (
            <section>
              <h2 className="mb-4 text-2xl font-bold text-foreground">Results</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {project?.results.map((result, index) => (
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
          {!!project?.testimonial?.quote && (
            <section className="rounded-xl border border-accent/30 bg-accent/5 p-8">
              <blockquote className="text-lg italic text-foreground">
                {'"'}{project?.testimonial.quote}{'"'}
              </blockquote>
              <div className="mt-4">
                <p className="font-semibold text-foreground">
                  {project?.testimonial.author}
                </p>
                <p className="text-sm text-muted-foreground">
                  {project?.testimonial.role}
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
