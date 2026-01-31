"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, Github } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Project } from "@/lib/projects-data"

interface ProjectsGridProps {
  projects: Project[]
  categories: { value: string; label: string }[]
}

export function ProjectsGrid({ projects, categories }: ProjectsGridProps) {
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredProjects = activeCategory === "all"
    ? projects
    : projects.filter((project) => project.category === activeCategory)

  return (
    <div>
      {/* Category Filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={activeCategory === category.value ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category.value)}
            className="rounded-full"
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No projects found in this category.</p>
        </div>
      )}
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link  href={`/projects/${project.id}`} className="group flex flex-col cursor-pointer overflow-hidden rounded-xl border border-border/50 bg-card transition-all hover:border-accent/30 hover:shadow-lg">
      {/* Project Image */}
      <div className="relative aspect-video  overflow-hidden bg-muted">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute left-3 top-3">
            <Badge className="bg-accent text-accent-foreground">Featured</Badge>
          </div>
        )}
        {/* Overlay on hover */}
        {/* <div className="absolute inset-0 flex items-center justify-center gap-3 bg-foreground/80 opacity-0 transition-opacity group-hover:opacity-100">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-background p-2 text-foreground transition-transform hover:scale-110"
              aria-label="View live site"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-background p-2 text-foreground transition-transform hover:scale-110"
              aria-label="View source code"
            >
              <Github className="h-5 w-5" />
            </a>
          )}
        </div> */}
      </div>

      {/* Project Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">{project.year}</span>
          {project.client && (
            <span className="text-xs text-muted-foreground">{project.client}</span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          <Link href={`/projects/${project.id}`} className="hover:text-accent">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {project.tags.length > 4 && (
            <Badge variant="secondary" className="text-xs">
              +{project.tags.length - 4}
            </Badge>
          )}
        </div>
         
      </div>
    </Link>
  )
}
