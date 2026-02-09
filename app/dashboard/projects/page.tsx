"use client"

import React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import { File } from "buffer"
import { toast } from "@/hooks/use-toast"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"

const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required").min(3, "Title must be at least 3 characters"),
  category: z.enum(["web", "mobile", "software"]),
  description: z.string().min(1, "Description is required").min(10, "Description must be at least 10 characters"),
  longDescription: z.string().min(1, "Long description is required").min(20, "Long description must be at least 20 characters"),
  year: z.string().min(4, "Year must be 4 digits").max(4, "Year must be 4 digits"),
  client: z.string().optional(),
  liveUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
})

type ProjectFormData = z.infer<typeof projectFormSchema>

export default function ProjectsManagementPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deleteProject, setDeleteProject] = useState<Project | null>(null)

  const { data: Projects } = useQuery<any>({
    queryKey: ['projects','all'],
  })

 
  useEffect(() => {
    // Ensure projects is always an array, never undefined
    if (!Projects) {
      setProjects([]);
      return;
    }
    

    if (Projects) {
     setProjects(Array.isArray(Projects?.data?.projects) ? Projects.data.projects : []);
    }
    
    
  }, [Projects]);

  const filteredProjects = projects.filter((project:any) => {
    const matchesSearch = project?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project?.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || project?.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleDeleteProject = async (id: string) => {
    setDeleting(true)
    try {
      await apiRequest("DELETE", `/projects/delete/${id}`)
      setProjects(projects.filter(p => p._id !== id))
      setDeleteProject(null)
      toast({
        title: "✓ Project Deleted",
        description: "The project has been removed from your portfolio.",
        duration: 3000,
      })
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Failed to delete project. Please try again."
      toast({
        title: "❌ Deletion Failed",
        description: errorMsg,
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setDeleting(false)
    }
    // if (deleteProject) {
    //   setProjects(projects.filter(p => p.id !== deleteProject._id))
    //   setDeleteProject(null)
    // }
  }

  const handleToggleFeatured = (projectId: string) => {
    setProjects(projects.map((p:any) => 
      p._id === projectId ? { ...p, featured: !p.featured } : p
    ))
  }

  const handleSaveProject = async (projectData: Project) => { 
    try {
      // Check if we're updating (projectData has _id) or creating (no _id)
      if (projectData._id) {
        // Update existing project
        await apiRequest("PUT", `/projects/update/${projectData._id}`, projectData)
        setProjects(projects.map((p:any) => p._id === projectData._id ? projectData : p))
        toast({
          title: "✓ Project Updated",
          description: `"${projectData.title}" has been updated successfully.`,
          duration: 3000,
        })
      } else {
        // Create new project
        await apiRequest("POST", "/projects/create", projectData)
        setProjects([...projects, projectData])
        toast({
          title: "✓ Project Created",
          description: `"${projectData.title}" has been added to your portfolio.`,
          duration: 3000,
        })
      }
      setIsAddDialogOpen(false)
      setEditingProject(null)
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Failed to save project. Please try again."
      console.error("Error saving project:", error)
      toast({
        title: "❌ Save Failed",
        description: errorMsg,
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight animate-fade-in [animation-delay:50ms]">Projects</h1>
          <p className="text-muted-foreground mt-1 animate-fade-in [animation-delay:100ms]">
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
        {filteredProjects.map((project:any, idx:number) => (
          <Card key={project._id} className="overflow-hidden pt-0 group animate-fade-in" style={{ animationDelay: `${idx * 75}ms` }}> 
            <div className="relative aspect-video bg-muted">
              <Image
                loading="lazy"
                src={project?.image?.url || "https://static.vecteezy.com/system/resources/previews/022/059/000/non_2x/no-image-available-icon-vector.jpg"}
                alt={project.title}
                fill
                className="object-fill h-96 w-full"
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
                {project?.technologies?.slice(0, 3).map((tag:any) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {project?.technologies.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.technologies.length - 3}
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
            <Button variant="destructive" onClick={() => deleteProject && handleDeleteProject(deleteProject._id)}>
              {deleting ? <span className="flex items-center gap-2"><Loader className="w-4 h-4 animate-spin" /> Deleting...</span> : <span className="flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</span>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


// project form dialog component
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
  const [imagePreview, setImagePreview] = useState<string>(project?.image?.url ?? "")
  const [tagsInput, setTagsInput] = useState<string>(project?.tags?.join(", ") ??  "")
  const [resultsInput, setResultsInput] = useState<string>(
    project?.results?.join("\n") ?? ""
  )
  const [duration, setDuration] = useState<string>(project?.duration ?? "")
  const [featured, setFeatured] = useState<boolean>(project?.featured ?? false)
  const [challenge, setChallenge] = useState<string>(project?.challenge ?? "")
  const [solution, setSolution] = useState<string>(project?.solution ?? "")
  const [testimonialQuote, setTestimonialQuote] = useState<string>(
    project?.testimonial?.quote ??  ""
  )
  const [testimonialAuthor, setTestimonialAuthor] = useState<string>(
    project?.testimonial?.author ??  ""
  )
  const [testimonialRole, setTestimonialRole] = useState<string>(
    project?.testimonial?.role ?? ""
  )
  const [selectedImage, setSelectedImage] = useState<File | any>(null)

  const [loading, setLoading] = useState<boolean>(false)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const { register, handleSubmit, watch, control, formState, reset } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    mode: "onChange",
    defaultValues: {
      title: project?.title ?? "",
      category: project?.category ?? "web",
      description: project?.description ?? "",
      longDescription: project?.longDescription ?? "",
      year: project?.year ?? "",
      client: project?.client ?? "",
      liveUrl: project?.liveUrl ?? "",
      githubUrl: project?.githubUrl ?? "",
    },
  })

  // Reset form when opening or when editing a new project
  React.useEffect(() => {
    // Reset form fields with current project data
    reset({
      title: project?.title ?? "",
      category: project?.category ?? "web",
      description: project?.description ?? "",
      longDescription: project?.longDescription ?? "",
      year: project?.year ?? "",
      client: project?.client ?? "",
      liveUrl: project?.liveUrl ?? "",
      githubUrl: project?.githubUrl ?? "",
    })
    
    setTagsInput(project?.technologies?.join(", ") ?? "")
    setResultsInput(project?.results?.join("\n") ?? "")
    setTestimonialQuote(project?.testimonial?.quote ?? "")
    setTestimonialAuthor(project?.testimonial?.author ?? "")
    setTestimonialRole(project?.testimonial?.role ?? "")
    setImagePreview(project?.image?.url ?? "")
    setDuration(project?.duration ?? "")
    setFeatured(project?.featured ?? false)
    setChallenge(project?.challenge ?? "")
    setSolution(project?.solution ?? "")
    setSelectedImage(null)
  }, [project, open, reset])

  const handleImageUpload = (file: any) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setImagePreview(result)
    }
    reader.readAsDataURL(file)
    setSelectedImage(file)
    
  }
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      handleImageUpload(files[0])
    }
  }

  const uploadFileToServer = async (file: any): Promise<string | null> => {
    if (!file) return null;
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const base = process.env.NEXT_PUBLIC_API_URL || "";
      const url = `${base}/projects/upload/image`;
      const resp = await axios.post(url, fd);
      return resp.data.data || null;
    } catch (err) {
      console.error("Error uploading image:", err);
      toast({
        title: "Image Upload Failed",
        description: "There was an error uploading the image. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleSubmit_form = async (values: ProjectFormData) => {
    setLoading(true)
    try {
      // upload image first (if a new image was selected)
      let imageUrl = null
      if (selectedImage) {
        imageUrl = await uploadFileToServer(selectedImage)
         
      }

      const payload: any = {
        ...values,
        _id: project?._id,
        tags: tagsInput.split(",").map(tag => tag.trim()).filter(tag => tag),
        results: resultsInput.split("\n").map(result => result.trim()).filter(result => result),
        duration,
        featured,
        challenge,
        solution,
        testimonial: {
          quote: testimonialQuote,
          author: testimonialAuthor,
          role: testimonialRole,
        },
        image: imageUrl || {url:project?.image?.url, public_id: project?.image?.public_id} || {} // use new image URL if uploaded, otherwise keep existing
      }
     

      // prefer delegating save to parent via onSave (handles create/update)
      if (onSave) {
        await onSave(payload)
        toast({
          title: "Success",
          description: `Project ${project ? "updated" : "added"} successfully.`,
        })
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      })
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
        <form onSubmit={handleSubmit(handleSubmit_form)} className="space-y-4">
          {/* Image Preview */}
          {imagePreview && (
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
              <img
                src={imagePreview}
                alt="Project preview"
                                className=" inset-0 w-full h-full object-cover"

              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <input
                  type="file"
                  id="imageChangeUpload"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleImageUpload(e.target.files[0])
                    }
                  }}
                  className="hidden"
                />
                <label htmlFor="imageChangeUpload">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => document.getElementById("imageChangeUpload")?.click()}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Change Image
                  </Button>
                </label>
              </div>
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
                {...register("title")}
              />
              {formState.errors.title && (
                <p className="text-sm text-destructive">{formState.errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="w-full" >
                      <SelectItem value="web">Web Development</SelectItem>
                      <SelectItem value="mobile">Mobile Apps</SelectItem>
                      <SelectItem value="software">Software Systems</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {formState.errors.category && (
                <p className="text-sm text-destructive">{formState.errors.category.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              rows={2}
            />
            {formState.errors.description && (
              <p className="text-sm text-destructive">{formState.errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="longDescription">Long Description</Label>
            <Textarea
              id="longDescription"
              {...register("longDescription")}
              rows={3}
            />
            {formState.errors.longDescription && (
              <p className="text-sm text-destructive">{formState.errors.longDescription.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                {...register("year")}
              />
              {formState.errors.year && (
                <p className="text-sm text-destructive">{formState.errors.year.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Input
                id="client"
                {...register("client")}
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
                 {...register("liveUrl")}
                 placeholder="https://example.com"
               />
               {formState.errors.liveUrl && (
                 <p className="text-sm text-destructive">{formState.errors.liveUrl.message}</p>
               )}
             </div>
             <div className="space-y-2">
               <Label htmlFor="githubUrl">GitHub URL</Label>
               <Input
                 id="githubUrl"
                 type="url"
                 {...register("githubUrl")}
                 placeholder="https://github.com/..."
               />
               {formState.errors.githubUrl && (
                 <p className="text-sm text-destructive">{formState.errors.githubUrl.message}</p>
               )}
             </div>
           </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 4 months"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="featured">Featured</Label>
              <div className="flex items-center gap-2">
                <Switch
                  id="featured"
                  checked={featured}
                  onCheckedChange={setFeatured}
                />
                <Label htmlFor="featured">Featured project</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="challenge">Challenge</Label>
            <Textarea
              id="challenge"
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="solution">Solution</Label>
            <Textarea
              id="solution"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
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
               {project ? (isUploading || loading) ? <span className="flex items-center gap-2"><Loader className="w-4 h-4 animate-spin" /> Saving Changes...</span> : "Save Changes" : (isUploading || loading) ? <span className="flex items-center gap-2"><Loader className="w-4 h-4 animate-spin" /> Adding Project...</span> : <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Add Project</span>}
             </Button>
           </DialogFooter>
         </form>
       </DialogContent>
     </Dialog>
   )
}
