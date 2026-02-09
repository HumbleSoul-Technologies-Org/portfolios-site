"use client"

import { ArrowRight, ExternalLink, Github } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import { useEffect,useState } from "react"

 
export function FeaturedProjects() {
  const { data: projects, isLoading, error } = useQuery<any>({
    queryKey: ["projects","all"],
  })

  const  [featuredProjects, setFeaturedProjects] = useState<any[]>([])

  useEffect(() => { 
    if (projects && projects.data && projects.data.projects.length > 0) {
      const featured = projects?.data?.projects.filter((project: any) => project.featured)
      setFeaturedProjects(featured)
    }
  }, [projects, isLoading, error])


  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-16 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end animate-fade-in">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-accent">
              Portfolio
            </p>
            <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Featured Projects
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              A selection of recent work showcasing my approach to solving complex problems.
            </p>
          </div>
          <Button asChild variant="outline" className="gap-2 bg-transparent transition-all hover:scale-105 active:scale-95">
            <Link href="/projects">
              View All Projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {(isLoading ? Array.from({ length: 3 }) : featuredProjects.slice(0, 4)).map((project: any, idx: number) => (
            <article
              key={isLoading ? `skeleton-${idx}` : project._id}
              className="group flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/20 animate-fade-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Project Image or Skeleton */}
              <div className="relative aspect-video overflow-hidden bg-muted">
                {isLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <>
                    <Image
                      src={project?.image?.url || "https://static.vecteezy.com/system/resources/previews/022/059/000/non_2x/no-image-available-icon-vector.jpg"}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 bg-foreground/80 opacity-0 transition-opacity group-hover:opacity-100">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-background p-2 text-foreground transition-transform hover:scale-110"
                        aria-label="View live site"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-background p-2 text-foreground transition-transform hover:scale-110"
                        aria-label="View source code"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    </div>
                  </>
                )}
              </div>

              {/* Project Content or Skeleton */}
              <div className="flex flex-1 flex-col p-6">
                {isLoading ? (
                  <>
                    <Skeleton className="h-6 w-2/3 mb-3" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-12" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-foreground">
                      <Link href={`/projects/${project.id}`} className="hover:text-accent">
                        {project.title}
                      </Link>
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">
                      {project.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.technologies.map((tag: any) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
