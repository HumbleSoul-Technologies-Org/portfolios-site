"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ProjectsGrid } from "@/components/projects/projects-grid"
import { categories } from "@/lib/projects-data"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])

  const { data: queryData, isLoading, error } = useQuery<any>({
    queryKey: ["projects","all"],
    
  });

  useEffect(() => {
    if (queryData) {
      // Handle both array and object response formats
      let projectsData = queryData?.data?.projects || queryData;
      if (Array.isArray(projectsData)) {
        setProjects(projectsData);
      } else if (projectsData) {
        setProjects([projectsData]);
      } else {
        setProjects([]);
      }
    }
  }, [queryData]);

  return (
    <div className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Page Header */}
        <div className="mb-16 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-widest text-accent">
            Portfolio
          </p>
          <h1 className="mt-2 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            My Projects
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A collection of work {"I've"} done for clients and personal projects. 
            Each project represents a unique challenge and solution.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-border/50">
                <Skeleton className="aspect-video w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            <p>Failed to load projects. Please try again later.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <FolderOpen className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">No Projects Yet</h2>
            <p className="mt-2 text-center text-muted-foreground max-w-md">
              I {"haven't"} shared any projects yet. Check back soon to see my latest work and portfolio pieces.
            </p>
            <Button asChild className="mt-6" variant="outline">
              <Link href="/">
                Back to Home
              </Link>
            </Button>
          </div>
        )}

        {/* Projects Grid with Filtering */}
        {!isLoading && !error && projects.length > 0 && (
          <ProjectsGrid projects={projects} categories={categories} />
        )}
      </div>
    </div>
  )
}
