import { Metadata } from "next"
import { ProjectsGrid } from "@/components/projects/projects-grid"
import { projects, categories } from "@/lib/projects-data"

export const metadata: Metadata = {
  title: "Projects | Your Name",
  description: "Explore my portfolio of web development, mobile apps, and software projects.",
}

export default function ProjectsPage() {
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

        {/* Projects Grid with Filtering */}
        <ProjectsGrid projects={projects} categories={categories} />
      </div>
    </div>
  )
}
