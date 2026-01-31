"use client"

import React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  ExternalLink,
  Star,
  Eye,
  Loader
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { projects as initialProjects, type Project, categories } from "@/lib/projects-data"
import { useProjects } from "@/lib/hooks";
// import { Project } from "@/lib/projects-data"
import { apiRequest } from "@/lib/queryClient"

export default function ProjectsManagementPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deleteProject, setDeleteProject] = useState<Project | null>(null)

  // const { data: remoteProjects } = useProjects();

  React.useEffect(() => {
    if (projects && Array.isArray(projects)) {
      setProjects(projects as Project[]);
    }
  }, [projects]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleDeleteProject = () => {
    if (deleteProject) {
      setProjects(projects.filter(p => p.id !== deleteProject.id))
      setDeleteProject(null)
    }
  }

  const handleToggleFeatured = (projectId: string) => {
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, featured: !p.featured } : p
    ))
  }

  const handleSaveProject = async (projectData: Project) => {
    try {
      if (projectData.id && projects.some(p => p.id === projectData.id)) {
        // Update existing project
        const response = await apiRequest("PUT", `/api/projects/${projectData.id}`, projectData)
        setProjects(projects.map(p => p.id === projectData.id ? response : p))
      } else {
        // Create new project
        const response = await apiRequest("POST", "/api/projects", projectData)
        setProjects([response, ...projects])
      }
      setIsAddDialogOpen(false)
      setEditingProject(null)
    } catch (error) {
      console.error("Error saving project:", error)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your portfolio projects
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-45">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="overflow-hidden group">
            <div className="relative aspect-video bg-muted">
              <Image
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                fill
                className="object-cover"
              />
              {project.featured && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-accent text-accent-foreground">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingProject(project)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleFeatured(project.id)}>
                      <Star className="h-4 w-4 mr-2" />
                      {project.featured ? "Remove from featured" : "Mark as featured"}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/projects/${project.id}`} target="_blank">
                        <Eye className="h-4 w-4 mr-2" />
                        View live
                      </Link>
                    </DropdownMenuItem>
                    {project.liveUrl && (
                      <DropdownMenuItem asChild>
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit site
                        </a>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={() => setDeleteProject(project)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold line-clamp-1">{project.title}</h3>
                <Badge variant="secondary" className="shrink-0 text-xs">
                  {project.category}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {project.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {project.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.tags.length - 3}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found matching your criteria.</p>
        </div>
      )}

      {/* Add/Edit Project Dialog */}
      <ProjectDialog
        open={isAddDialogOpen || !!editingProject}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false)
            setEditingProject(null)
          }
        }}
        project={editingProject}
        onSave={handleSaveProject}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteProject} onOpenChange={() => setDeleteProject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteProject?.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteProject(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProject}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ProjectDialog({
  open,
  onOpenChange,
  project,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project | null
  onSave: (project: Project) => Promise<void>
}) {
  const [imagePreview, setImagePreview] = useState<string>(project?.image ?? "")
  const [formData, setFormData] = useState<Record<string, any>>(project  ?? {})
  const [tagsInput, setTagsInput] = useState<string>(project?.tags?.join(", ") ??  "")
  const [resultsInput, setResultsInput] = useState<string>(
    project?.results?.join("\n") ?? ""
  )
  const [testimonialQuote, setTestimonialQuote] = useState<string>(
    project?.testimonial?.quote ??  ""
  )
  const [testimonialAuthor, setTestimonialAuthor] = useState<string>(
    project?.testimonial?.author ??  ""
  )
  const [testimonialRole, setTestimonialRole] = useState<string>(
    project?.testimonial?.role ?? ""
  )
  const [loading, setLoading] = useState<boolean>(false)

  // Reset form when opening or when editing a new project
  React.useEffect(() => {
    setFormData(project ??  {})
    setTagsInput(project?.tags?.join(", ") ?? "")
    setResultsInput(project?.results?.join("\n") ?? "")
    setTestimonialQuote(project?.testimonial?.quote ?? "")
    setTestimonialAuthor(project?.testimonial?.author ?? "")
    setTestimonialRole(project?.testimonial?.role ?? "")
    setImagePreview(project?.image ?? "")
  }, [project, open])

  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setImagePreview(result)
      setFormData({ ...formData, image: result })
    }
    reader.readAsDataURL(file)
  }
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      handleImageUpload(files[0])
    }
  }
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const id = project?.id || formData.title?.toLowerCase().replace(/\s+/g, "-") || ""
       const results = resultsInput.split(/\n/).map((r) => r.trim()).filter(Boolean)
       const testimonial = {
         quote: testimonialQuote,
         author: testimonialAuthor,
         role: testimonialRole,
       }

      await onSave({
         ...formData,
         id,
         tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
         results,
         testimonial,
       } as Project)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setLoading(false)
    }
   }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-background max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Add New Project"}</DialogTitle>
          <DialogDescription>
            {project ? "Update the project details below." : "Fill in the details for your new project."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Preview */}
          {imagePreview && (
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              <Image
                src={imagePreview}
                alt="Project preview"
                fill
                className="object-cover"
              />
            </div>
          )}
          
            {/* Image Upload Drop Zone */}

          {imagePreview === "" && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
          >
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleImageUpload(e.target.files[0])
                }
              }}
              className="hidden"
            />
            <label htmlFor="imageUpload" className="cursor-pointer block">
              <p className="text-sm font-medium">Drag and drop your image here</p>
              <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
            </label>
          </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                
                value={formData.category}
                onValueChange={(value: "web" | "mobile" | "software") =>
                  setFormData({ ...formData, category: value })
                }
                
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="w-full" >
                  <SelectItem value="web">Web Development</SelectItem>
                  <SelectItem value="mobile">Mobile Apps</SelectItem>
                  <SelectItem value="software">Software Systems</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longDescription">Long Description</Label>
            <Textarea
              id="longDescription"
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Input
                id="client"
                value={formData.client || ""}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Technologies Used (comma separated)</Label>
             <Input
               id="tags"
               value={tagsInput}
               onChange={(e) => setTagsInput(e.target.value)}
               placeholder="Next.js, React, TypeScript"
             />
           </div>

           <div className="grid gap-4 sm:grid-cols-2">
             <div className="space-y-2">
               <Label htmlFor="liveUrl">Live URL</Label>
               <Input
                 id="liveUrl"
                 type="url"
                 value={formData.liveUrl || ""}
                 onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                 placeholder="https://example.com"
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="githubUrl">GitHub URL</Label>
               <Input
                 id="githubUrl"
                 type="url"
                 value={formData.githubUrl || ""}
                 onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                 placeholder="https://github.com/..."
               />
             </div>
           </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration || ""}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 4 months"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="featured">Featured</Label>
              <div className="flex items-center gap-2">
                <Switch
                  id="featured"
                  checked={Boolean(formData.featured)}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="featured">Featured project</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="challenge">Challenge</Label>
            <Textarea
              id="challenge"
              value={formData.challenge || ""}
              onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="solution">Solution</Label>
            <Textarea
              id="solution"
              value={formData.solution || ""}
              onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="results">Results (one per line)</Label>
            <Textarea
              id="results"
              value={resultsInput}
              onChange={(e) => setResultsInput(e.target.value)}
              rows={3}
              placeholder="45% increase in conversion rate\n2x faster page load times\n..."
            />
          </div>

          <div className="space-y-2">
            <Label>Testimonial</Label>
            <Textarea
              id="testimonialQuote"
              value={testimonialQuote}
              onChange={(e) => setTestimonialQuote(e.target.value)}
              rows={2}
              placeholder="Quote..."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="testimonialAuthor"
                value={testimonialAuthor}
                onChange={(e) => setTestimonialAuthor(e.target.value)}
                placeholder="Author"
              />
              <Input
                id="testimonialRole"
                value={testimonialRole}
                onChange={(e) => setTestimonialRole(e.target.value)}
                placeholder="Role / Company"
              />
            </div>
          </div>

           <DialogFooter>
             <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
               Cancel
             </Button>
             <Button type="submit">
               {project ? loading ?<span className="flex items-center gap-2"><Loader className="w-4 h-4 animate-spin" /> Saving Changes...</span> :"Save Changes": loading   ? <span className="flex items-center gap-2"><Loader className="w-4 h-4 animate-spin" /> Adding Project...</span> :<span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Add Project</span>}
             </Button>
           </DialogFooter>
         </form>
       </DialogContent>
     </Dialog>
   )
}
