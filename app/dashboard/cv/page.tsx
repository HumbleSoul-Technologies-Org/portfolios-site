"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  Plus, 
  Pencil, 
  Trash2, 
  GripVertical,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Languages,
  Download,
  Save,
  Loader
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiRequest } from "@/lib/queryClient"
import { set } from "react-hook-form"
import { toast } from "@/hooks/use-toast"
import { useQuery } from "@tanstack/react-query"
import { log } from "console"

// Zod schemas for CV forms
const experienceSchema = z.object({
  title: z.string().min(1, "Job title is required").min(2, "Job title must be at least 2 characters"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().min(1, "Location is required"),
  period: z.string().min(1, "Period is required"),
  description: z.string().min(1, "Description is required").min(10, "Description must be at least 10 characters"),
})

const educationSchema = z.object({
  degree: z.string().min(1, "Degree/Qualification is required"),
  institution: z.string().min(1, "Institution name is required"),
  location: z.string().min(1, "Location is required"),
  period: z.string().min(1, "Period is required"),
  description: z.string().optional(),
})

const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required").min(2, "Skill name must be at least 2 characters"),
  category: z.enum(["Technical Skills", "Soft Skills", "Professional Skills", "Other"]),
  level: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]),
})

const certificationSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer name is required"),
  date: z.string().min(1, "Date is required"),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
})

const languageSchema = z.object({
  name: z.string().min(1, "Language name is required"),
  level: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]),
})

type ExperienceFormData = z.infer<typeof experienceSchema>
type EducationFormData = z.infer<typeof educationSchema>
type SkillFormData = z.infer<typeof skillSchema>
type CertificationFormData = z.infer<typeof certificationSchema>
type LanguageFormData = z.infer<typeof languageSchema>

interface Experience {
  _id: string
  title: string
  company: string
  location: string
  period: string
  description: string
  current: boolean
}

interface Education {
  _id: string
  degree: string
  institution: string
  location: string
  period: string
  description: string
}

interface Skill {
  _id: string
  name: string
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  category: "Technical Skills" | "Soft Skills" | "Professional Skills" | "Other"
}

interface Certification {
  _id: string
  name: string
  issuer: string
  date: string
  url?: string
}

interface Language {
  _id: string
  name: string
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
}

 

export default function CVManagementPage() {
  const [experience, setExperience] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [loading, setLoading] = useState(false)
  const [resume, setResume] = useState<any>({})
  const [skillFilter, setSkillFilter] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const { data:cv, error } = useQuery<any>({
    queryKey: ["resume","current"],
  })
  
  const [editDialog, setEditDialog] = useState<{
    type: "experience" | "education" | "skill" | "certification" | "language" | null
    data: Experience | Education | Skill | Certification | Language | null
    isNew: boolean
  }>({ type: null, data: null, isNew: false })

  const [deleteDialog, setDeleteDialog] = useState<{
    type: "experience" | "education" | "skill" | "certification" | "language" | null
    id: string | null
    name: string
  }>({ type: null, id: null, name: "" })

  useEffect(() => {
    if (cv) {
      // Handle case where API returns array of objects
      let data = cv.data
      if (Array.isArray(data)) {
        data = data.length > 0 ? data[0] : {}
      }
      setResume(data?.resume || {})
      setExperience(data?.resume?.experience || [])
      setEducation(data?.resume?.education || [])
      setSkills(data?.resume?.skill || [])
      setCertifications(data?.resume?.certification || [])
      setLanguages(data?.resume?.language || [])
 
    }
   }, [cv])



  const getLevelColor = (level: string) => {
    switch (level) {
      case "Expert": return "bg-accent text-accent-foreground"
      case "Advanced": return "bg-primary text-primary-foreground"
      case "Intermediate": return "bg-secondary text-secondary-foreground"
      default: return "bg-muted text-muted-foreground"
    }
  }

  //Creating and updating functions
  const saveExperience = async (data: Experience) => { 
    try {
      setLoading(true)
      if (!data) {
        throw new Error("No data provided")
      }

      if (editDialog.isNew) {
       const payLoad = {experience:data, id:resume._id||""}
        await apiRequest("POST", `/resume/experience/create`,payLoad)
        toast({
          title: "✓ Experience Added",
          description: `"${data.title}" has been added to your experience.`,
          duration: 3000,
        })
      } else {
         const index = experience.findIndex(exp => (exp as any)._id === data._id)
         await apiRequest("PUT", `/resume/update/${resume?._id }/${editDialog?.type}/${index}`, {experience:data})
        toast({
          title: "✓ Experience Updated",
          description: `"${data.title}" has been updated successfully.`,
          duration: 3000,
        })
      }
    } catch (error: any) {
      toast({
        title: "✗ Save Failed",
        description: error?.message || "An error occurred while saving experience. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }
  const saveEducation = async (data: Education) => { 
    try {
      setLoading(true)
      if (!data) {
        throw new Error("No data provided")
      }

      if (editDialog.isNew) {
       const payLoad = {education:data, id:resume._id||""}
        await apiRequest("POST", `/resume/education/create`,payLoad)
        toast({
          title: "✓ Education Added",
          description: `"${data.degree}" has been added to your education.`,
          duration: 3000,
        })
      } else {
        const index = education.findIndex(edu => (edu as any)._id === data._id)
         await apiRequest("PUT", `/resume/update/${resume?._id }/${editDialog?.type}/${index}`, {education:data})
        toast({
          title: "✓ Education Updated",
          description: `"${data.degree}" has been updated successfully.`,
          duration: 3000,
        })
      }
    } catch (error: any) {
      toast({
        title: "✗ Save Failed",
        description: error?.message || "An error occurred while saving education. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }
  const saveSkills = async (data: Skill) => { 
    try {
      setLoading(true)
      if (!data) {
        throw new Error("No data provided")
      }

      if (editDialog.isNew) {
       const payLoad = {skill:data, id:resume._id||""}
        await apiRequest("POST", `/resume/skill/create`,payLoad)
        toast({
          title: "✓ Skill Added",
          description: `"${data.name}" has been added to your skills.`,
          duration: 3000,
        })
      } else {
        const index = skills.findIndex(skill => (skill as any)._id === data._id)
         await apiRequest("PUT", `/resume/update/${resume?._id }/${editDialog?.type}/${index}`, {skill:data})
        toast({
          title: "✓ Skill Updated",
          description: `"${data.name}" has been updated successfully.`,
          duration: 3000,
        })
      }
    } catch (error: any) {
      toast({
        title: "✗ Save Failed",
        description: error?.message || "An error occurred while saving skills. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }
  const saveCertification = async (data: Certification) => { 
    try {
      setLoading(true)
      if (!data) {
        throw new Error("No data provided")
      }

      if (editDialog.isNew) {
       const payLoad = {certification:data, id:resume._id||""}
        await apiRequest("POST", `/resume/certification/create`,payLoad)
        toast({
          title: "✓ Certification Added",
          description: `"${data.name}" has been added to your certifications.`,
          duration: 3000,
        })
      } else {
        const index = certifications.findIndex(cert => (cert as any)._id === data._id)
         await apiRequest("PUT", `/resume/update/${resume?._id }/${editDialog?.type}/${index}`, {certification:data})
        toast({
          title: "✓ Certification Updated",
          description: `"${data.name}" has been updated successfully.`,
          duration: 3000,
        })
      }
    } catch (error: any) {
      toast({
        title: "✗ Save Failed",
        description: error?.message || "An error occurred while saving certifications. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }
  const saveLanguages = async (data: Language) => { 
    try {
      setLoading(true)
      if (!data) {
        throw new Error("No data provided")
      }

      if (editDialog.isNew) {
       const payLoad = {language:data, id:resume._id||""}
        await apiRequest("POST", `/resume/language/create`,payLoad)
        toast({
          title: "✓ Language Added",
          description: `"${data.name}" has been added to your languages.`,
          duration: 3000,
        })
      } else {
       
        const index = languages.findIndex(lang => (lang as any)._id === data._id)
         await apiRequest("PUT", `/resume/update/${resume?._id }/${editDialog?.type}/${index}`, {language:data})
        toast({
          title: "✓ Language Updated",
          description: `"${data.name}" has been updated successfully.`,
          duration: 3000,
        })
      }
    } catch (error: any) {
      toast({
        title: "✗ Save Failed",
        description: error?.message || "An error occurred while saving languages. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  // functions for deleting items from each section
  const handleDelete = async () => {
    if (!deleteDialog.type || !deleteDialog.id) return

    setDeleting(deleteDialog.id)

    try {
      switch (deleteDialog.type) {
        case "experience": {
          const expIndex = experience.findIndex(exp => (exp as any).id === deleteDialog.id || (exp as any)._id === deleteDialog.id)
          if (expIndex >= 0) {
            await apiRequest("DELETE", `/resume/delete/${resume?._id}/${deleteDialog.type}/${expIndex}`)
          }
          setExperience(experience.filter(e => (e as any).id !== deleteDialog.id && (e as any)._id !== deleteDialog.id))
          break
        }
        case "education": {
          const eduIndex = education.findIndex(educ => (educ as any).id === deleteDialog.id || (educ as any)._id === deleteDialog.id)
          if (eduIndex >= 0) {
            await apiRequest("DELETE", `/resume/delete/${resume?._id}/${deleteDialog.type}/${eduIndex}`)
          }
          setEducation(education.filter(e => (e as any).id !== deleteDialog.id && (e as any)._id !== deleteDialog.id))
          break
        }
        case "skill": {
          const skIndex = skills.findIndex(skill => (skill as any).id === deleteDialog.id || (skill as any)._id === deleteDialog.id)
          if (skIndex >= 0) {
            await apiRequest("DELETE", `/resume/delete/${resume?._id}/${deleteDialog.type}/${skIndex}`)
          }
          setSkills(skills.filter(s => (s as any).id !== deleteDialog.id && (s as any)._id !== deleteDialog.id))
          break
        }
        case "certification": {
          const certIndex = certifications.findIndex(cert => (cert as any).id === deleteDialog.id || (cert as any)._id === deleteDialog.id)
          if (certIndex >= 0) {
            await apiRequest("DELETE", `/resume/delete/${resume?._id}/${deleteDialog.type}/${certIndex}`)
          }
          setCertifications(certifications.filter(c => (c as any).id !== deleteDialog.id && (c as any)._id !== deleteDialog.id))
          break
        }
        case "language": {
          const lanIndex = languages.findIndex(lang => (lang as any).id === deleteDialog.id || (lang as any)._id === deleteDialog.id)
          if (lanIndex >= 0) {
            await apiRequest("DELETE", `/resume/delete/${resume?._id}/${deleteDialog.type}/${lanIndex}`)
          }
          setLanguages(languages.filter(l => (l as any).id !== deleteDialog.id && (l as any)._id !== deleteDialog.id))
          break
        }
      }
      toast({
        title: "✓ Item Deleted",
        description: `The ${deleteDialog.type} has been removed.`,
        duration: 3000,
      })
    } catch (err: any) {
      toast({
        title: "✗ Delete Failed",
        description: err?.message || "Failed to delete item. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setDeleting(null)
      setDeleteDialog({ type: null, id: null, name: "" })
    }
  }


  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight animate-fade-in [animation-delay:50ms]">CV Manager</h1>
          <p className="text-muted-foreground mt-1 animate-fade-in [animation-delay:100ms]">
            Manage your resume and professional information
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>

      <Tabs defaultValue="experience" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="experience" className="gap-2">
            <Briefcase className="h-4 w-4 hidden sm:block" />
            Experience
          </TabsTrigger>
          <TabsTrigger value="education" className="gap-2">
            <GraduationCap className="h-4 w-4 hidden sm:block" />
            Education
          </TabsTrigger>
          <TabsTrigger value="skills" className="gap-2">
            <Code className="h-4 w-4 hidden sm:block" />
            Skills
          </TabsTrigger>
          <TabsTrigger value="certifications" className="gap-2">
            <Award className="h-4 w-4 hidden sm:block" />
            Certs
          </TabsTrigger>
          <TabsTrigger value="languages" className="gap-2">
            <Languages className="h-4 w-4 hidden sm:block" />
            Languages
          </TabsTrigger>
        </TabsList>

        {/* Experience Tab */}
        <TabsContent value="experience" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setEditDialog({ 
              type: "experience", 
              data: { _id:"", title: "", company: "", location: "", period: "", description: "", current: false },
              isNew: true 
            })}>
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </div>
          {experience.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">No experience entries. Click "Add Experience" to create one.</div>
          ) : (
          <div className="space-y-4">
            {(() => {
              const items:any = []
              experience.forEach((exp) => {
                const expId = (exp as any).id || (exp as any)._id
                items.push(
                  <Card key={expId} className="group">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* <div className="hidden sm:flex mt-1 text-muted-foreground cursor-grab">
                          <GripVertical className="h-5 w-5" />
                        </div> */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold">{exp.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {exp.company} • {exp.location}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {exp.current && (
                                <Badge className="bg-accent text-accent-foreground shrink-0">Current</Badge>
                              )}
                              <span className="text-sm text-muted-foreground shrink-0">{exp.period}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => setEditDialog({ type: "experience", data: exp, isNew: false })}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteDialog({ type: "experience", id: expId, name: exp.title })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
              return items
            })()}
          </div>
          )}
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setEditDialog({ 
              type: "education", 
              data: { _id:"", degree: "", institution: "", location: "", period: "", description: "" },
              isNew: true 
            })}>
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </div>
          {education.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">No education entries. Click "Add Education" to create one.</div>
          ) : (
          <div className="space-y-4">
            {(() => {
              const items:any = []
              education.forEach((edu) => {
                const eduId = (edu as any).id || (edu as any)._id
                items.push(
                  <Card key={eduId} className="group">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="hidden sm:flex mt-1 text-muted-foreground cursor-grab">
                          <GripVertical className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold">{edu.degree}</h3>
                              <p className="text-sm text-muted-foreground">
                                {edu.institution} • {edu.location}
                              </p>
                            </div>
                            <span className="text-sm text-muted-foreground shrink-0">{edu.period}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">{edu.description}</p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => setEditDialog({ type: "education", data: edu, isNew: false })}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteDialog({ type: "education", id: eduId, name: edu.degree })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
              return items
            })()}
          </div>
          )}
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={skillFilter === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSkillFilter(null)}
              >
                All
              </Button>
              <Button
                variant={skillFilter === "Technical Skills" ? "default" : "outline"}
                size="sm"
                onClick={() => setSkillFilter("Technical Skills")}
              >
                Technical Skills
              </Button>
              <Button
                variant={skillFilter === "Soft Skills" ? "default" : "outline"}
                size="sm"
                onClick={() => setSkillFilter("Soft Skills")}
              >
                Soft Skills
              </Button>
              <Button
                variant={skillFilter === "Professional Skills" ? "default" : "outline"}
                size="sm"
                onClick={() => setSkillFilter("Professional Skills")}
              >
                Professional Skills
              </Button>
              <Button
                variant={skillFilter === "Other" ? "default" : "outline"}
                size="sm"
                onClick={() => setSkillFilter("Other")}
              >
                Other
              </Button>
            </div>
            <Button onClick={() => setEditDialog({ 
              type: "skill", 
              data: {_id:"", name: "", level: "Intermediate", category: "Technical Skills"},
              isNew: true 
            })}>
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Technical Skills</CardTitle>
              <CardDescription>Your skills organized by category</CardDescription>
            </CardHeader>
            <CardContent>
              {skills.filter(skill => skillFilter === null || skill.category === skillFilter).length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground">No skills found for the selected category. Click "Add Skill" to create one.</div>
              ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(
                  skills
                    .filter(skill => skillFilter === null || skill.category === skillFilter)
                    .reduce((acc, skill) => {
                    if (!acc[skill.category]) acc[skill.category] = []
                    acc[skill.category].push(skill)
                    return acc
                  }, {} as Record<string, Skill[]>)
                ).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-accent mb-3">{category}</h4>
                    <div className="space-y-2">
                      {(() => {
                        const items:any = []
                        categorySkills.forEach((skill) => {
                          const skillId = (skill as any).id || (skill as any)._id
                          items.push(
                            <div 
                              key={skillId} 
                              className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-muted/50 group"
                            >
                              <span className="text-sm">{skill.name}</span>
                              <div className="flex items-center gap-2">
                                <Badge className={getLevelColor(skill.level)} variant="secondary">
                                  {skill.level}
                                </Badge>
                                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6"
                                    onClick={() => setEditDialog({ type: "skill", data: skill, isNew: false })}
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 text-destructive hover:text-destructive"
                                    onClick={() => setDeleteDialog({ type: "skill", id: skillId, name: skill.name })}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )
                        })
                        return items
                      })()}
                    </div>
                  </div>
                ))}
              </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setEditDialog({ 
              type: "certification", 
              data: {_id:"", name: "", issuer: "", date: "", url: "" },
              isNew: true 
            })}>
              <Plus className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          </div>
          {certifications.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">No certifications yet. Click "Add Certification" to create one.</div>
          ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {(() => {
              const items:any = []
              certifications.forEach((cert) => {
                const certId = (cert as any).id || (cert as any)._id
                items.push(
                  <Card key={certId} className="group">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                            <Award className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{cert.name}</h3>
                            <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                            <p className="text-xs text-muted-foreground mt-1">{cert.date}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => setEditDialog({ type: "certification", data: cert, isNew: false })}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteDialog({ type: "certification", id: certId, name: cert.name })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
              return items
            })()}
          </div>
          )}
        </TabsContent>

        {/* Languages Tab */}
        <TabsContent value="languages" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setEditDialog({ 
              type: "language", 
              data: {_id:"", name: "", level: "Intermediate"},
              isNew: true 
            })}>
              <Plus className="h-4 w-4 mr-2" />
              Add Language
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Languages</CardTitle>
              <CardDescription>Languages you speak and your proficiency level</CardDescription>
            </CardHeader>
            <CardContent>
              {languages.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground">No languages added yet. Click "Add Language" to create one.</div>
              ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(() => {
                  const items:any = []
                  languages.forEach((lang,index) => {
                    const langId =  (lang as any)._id
                    items.push(
                      <div 
                        key={langId} 
                        className="flex items-center justify-between p-3 rounded-lg border group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                            {lang.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{lang.name}</p>
                            <p className="text-xs text-muted-foreground">{lang.level}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => setEditDialog({ type: "language", data: lang, isNew: false })}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => setDeleteDialog({ type: "language", id: langId, name: lang.name })}
                          >
                            {deleting === langId ? <Loader className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                          </Button>
                        </div>
                      </div>
                    )
                  })
                  return items
                })()}
              </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialogs */}
      <ExperienceDialog
        open={editDialog.type === "experience"}
        onOpenChange={() => setEditDialog({ type: null, data: null, isNew: false })}
        data={editDialog.data as Experience}
        isNew={editDialog.isNew}
        onSave={(data) => {
          saveExperience(data)
          setEditDialog({ type: null, data: null, isNew: false })
        }}
        loading={loading}
      />

      <EducationDialog
        open={editDialog.type === "education"}
        onOpenChange={() => setEditDialog({ type: null, data: null, isNew: false })}
        data={editDialog.data as Education}
        isNew={editDialog.isNew}
        onSave={(data) => {
          saveEducation(data)
          setEditDialog({ type: null, data: null, isNew: false })
        }}
        loading={loading}

      />

      <SkillDialog
        open={editDialog.type === "skill"}
        onOpenChange={() => setEditDialog({ type: null, data: null, isNew: false })}
        data={editDialog.data as Skill}
        isNew={editDialog.isNew}
        onSave={(data) => {
          saveSkills(data)
          setEditDialog({ type: null, data: null, isNew: false })
        }}
        loading={loading}

      />

      <CertificationDialog
        open={editDialog.type === "certification"}
        onOpenChange={() => setEditDialog({ type: null, data: null, isNew: false })}
        data={editDialog.data as Certification}
        isNew={editDialog.isNew}
        onSave={(data) => {
          saveCertification(data)
          setEditDialog({ type: null, data: null, isNew: false })
        }}
        loading={loading}
      />

      <LanguageDialog
        open={editDialog.type === "language"}
        onOpenChange={() => setEditDialog({ type: null, data: null, isNew: false })}
        data={editDialog.data as Language}
        isNew={editDialog.isNew}
        onSave={(data) => {
          saveLanguages(data)
          setEditDialog({ type: null, data: null, isNew: false })
        }}
        loading={loading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog.type} onOpenChange={() => setDeleteDialog({ type: null, id: null, name: "" })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {deleteDialog.type}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteDialog.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ type: null, id: null, name: "" })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {deleting === deleteDialog.id ? <Loader className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Dialog Components
function ExperienceDialog({ open, onOpenChange, data, isNew, onSave ,loading}: {
  open: boolean
  onOpenChange: () => void
  data: Experience | null
  isNew: boolean
  onSave: (data: Experience) => void
  loading: boolean
}) {
  const { register, handleSubmit, control, formState, reset } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    mode: "onChange",
    defaultValues: {
      title: data?.title ?? "",
      company: data?.company ?? "",
      location: data?.location ?? "",
      period: data?.period ?? "",
      description: data?.description ?? "",
    },
  })

  useEffect(() => {
    if (data && open) {
      reset({
        title: data.title,
        company: data.company,
        location: data.location,
        period: data.period,
        description: data.description,
      })
    } else if (!data && isNew) {
      reset({
        title: "",
        company: "",
        location: "",
        period: "",
        description: "",
      })
    }
  }, [data, open, isNew, reset])
  
  if (!open) return null
  
  const handleSaveExperience = async (values: ExperienceFormData) => {
    onSave({
      ...data,
      ...values,
      _id: data?._id || "",
      current: data?.current ?? false,
    } as Experience)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isNew ? "Add Experience" : "Edit Experience"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSaveExperience)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Job Title</Label>
              <Input {...register("title")} />
              {formState.errors.title && (
                <p className="text-sm text-destructive">{formState.errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input {...register("company")} />
              {formState.errors.company && (
                <p className="text-sm text-destructive">{formState.errors.company.message}</p>
              )}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input {...register("location")} />
              {formState.errors.location && (
                <p className="text-sm text-destructive">{formState.errors.location.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Period</Label>
              <Input {...register("period")} placeholder="2023 - Present" />
              {formState.errors.period && (
                <p className="text-sm text-destructive">{formState.errors.period.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea {...register("description")} rows={3} />
            {formState.errors.description && (
              <p className="text-sm text-destructive">{formState.errors.description.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onOpenChange}>Cancel</Button>
            <Button type="submit" disabled={loading || !formState.isValid}>{loading ? <>Saving... <Save className="h-4 w-4 ml-2 animate-bounce" /></> : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EducationDialog({ open, onOpenChange, data, isNew, onSave,loading }: {
  open: boolean
  onOpenChange: () => void
  data: Education | null
  isNew: boolean
  loading: boolean
  onSave: (data: Education) => void
}) {
  const { register, handleSubmit, control, formState, reset } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    mode: "onChange",
    defaultValues: {
      degree: data?.degree ?? "",
      institution: data?.institution ?? "",
      location: data?.location ?? "",
      period: data?.period ?? "",
      description: data?.description ?? "",
    },
  })

  useEffect(() => {
    if (data && open) {
      reset({
        degree: data.degree,
        institution: data.institution,
        location: data.location,
        period: data.period,
        description: data.description,
      })
    } else if (!data && isNew) {
      reset({
        degree: "",
        institution: "",
        location: "",
        period: "",
        description: "",
      })
    }
  }, [data, open, isNew, reset])
  
  if (!open) return null
  
  const handleSaveEducation = async (values: EducationFormData) => {
    onSave({
      ...data,
      ...values,
      _id: data?._id || "",
    } as Education)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isNew ? "Add Education" : "Edit Education"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSaveEducation)} className="space-y-4">
          <div className="space-y-2">
            <Label>Degree / Qualification</Label>
            <Input {...register("degree")} />
            {formState.errors.degree && (
              <p className="text-sm text-destructive">{formState.errors.degree.message}</p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Institution</Label>
              <Input {...register("institution")} />
              {formState.errors.institution && (
                <p className="text-sm text-destructive">{formState.errors.institution.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input {...register("location")} />
              {formState.errors.location && (
                <p className="text-sm text-destructive">{formState.errors.location.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Period</Label>
            <Input {...register("period")} placeholder="2015 - 2019" />
            {formState.errors.period && (
              <p className="text-sm text-destructive">{formState.errors.period.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea {...register("description")} rows={2} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onOpenChange}>Cancel</Button>
            <Button type="submit" disabled={loading || !formState.isValid}>{loading ? <>Saving... <Save className="h-4 w-4 ml-2 animate-bounce" /></> : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function SkillDialog({ open, onOpenChange, data, isNew, onSave, loading }: {
  open: boolean
  onOpenChange: () => void
  data: Skill | null
  isNew: boolean
  onSave: (data: Skill) => void
  loading: boolean
}) {
  const { register, handleSubmit, formState, reset } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    mode: "onChange",
    defaultValues: {
      name: data?.name ?? "",
      category: data?.category ?? "Technical Skills",
      level: data?.level ?? "Intermediate",
    },
  })

  useEffect(() => {
    if (data && open) {
      reset({
        name: data.name,
        category: data.category,
        level: data.level,
      })
    } else if (!data && isNew) {
      reset({
        name: "",
        category: "Technical Skills",
        level: "Intermediate",
      })
    }
  }, [data, open, isNew, reset])
  
  if (!open) return null
  
  const handleSaveSkill = (values: SkillFormData) => {
    onSave({
      ...data,
      ...values,
      _id: data?._id || "",
    } as Skill)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isNew ? "Add Skill" : "Edit Skill"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSaveSkill)} className="space-y-4">
          <div className="space-y-2">
            <Label>Skill Name</Label>
            <Input {...register("name")} />
            {formState.errors.name && (
              <p className="text-sm text-destructive">{formState.errors.name.message}</p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                {...register("category")}
                className="flex h-9 w-full cursor-pointer rounded-md border border-input bg-white text-background px-3 py-1 text-sm shadow-xs"
              >
                <option value="Technical Skills">Technical Skills</option>
                <option value="Soft Skills">Soft Skills</option>
                <option value="Professional Skills">Professional Skills</option>
                <option value="Other">Other</option>
              </select>
              {formState.errors.category && (
                <p className="text-sm text-destructive">{formState.errors.category.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <select 
                {...register("level")}
                className="flex h-9 w-full cursor-pointer rounded-md border border-input bg-white text-background px-3 py-1 text-sm shadow-xs"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              {formState.errors.level && (
                <p className="text-sm text-destructive">{formState.errors.level.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onOpenChange}>Cancel</Button>
            <Button type="submit" disabled={loading || !formState.isValid}>{loading ? <>Saving... <Save className="h-4 w-4 ml-2 animate-bounce" /></> : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function CertificationDialog({ open, onOpenChange, data, isNew, onSave, loading }: {
  open: boolean
  onOpenChange: () => void
  data: Certification | null
  isNew: boolean
  onSave: (data: Certification) => void
  loading: boolean
}) {
  const { register, handleSubmit, control, formState, reset } = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
    mode: "onChange",
    defaultValues: {
      name: data?.name ?? "",
      issuer: data?.issuer ?? "",
      date: data?.date ?? "",
      url: data?.url ?? "",
    },
  })

  useEffect(() => {
    if (data && open) {
      reset({
        name: data.name,
        issuer: data.issuer,
        date: data.date,
        url: data.url,
      })
    } else if (!data && isNew) {
      reset({
        name: "",
        issuer: "",
        date: "",
        url: "",
      })
    }
  }, [data, open, isNew, reset])
  
  if (!open) return null
  
  const handleSaveCertification = async (values: CertificationFormData) => {
    onSave({
      ...data,
      ...values,
      _id: data?._id || "",
    } as Certification)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isNew ? "Add Certification" : "Edit Certification"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSaveCertification)} className="space-y-4">
          <div className="space-y-2">
            <Label>Certification Name</Label>
            <Input {...register("name")} />
            {formState.errors.name && (
              <p className="text-sm text-destructive">{formState.errors.name.message}</p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Issuing Organization</Label>
              <Input {...register("issuer")} />
              {formState.errors.issuer && (
                <p className="text-sm text-destructive">{formState.errors.issuer.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input {...register("date")} placeholder="2024" />
              {formState.errors.date && (
                <p className="text-sm text-destructive">{formState.errors.date.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Credential URL (optional)</Label>
            <Input {...register("url")} placeholder="https://..." />
            {formState.errors.url && (
              <p className="text-sm text-destructive">{formState.errors.url.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onOpenChange}>Cancel</Button>
            <Button type="submit" disabled={loading || !formState.isValid}>{loading ? <>Saving... <Save className="h-4 w-4 ml-2 animate-bounce" /></> : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function LanguageDialog({ open, onOpenChange, data, isNew, onSave, loading }: {
  open: boolean
  onOpenChange: () => void
  data: Language | null
  isNew: boolean
  onSave: (data: Language) => void
  loading: boolean
}) {
  const { register, handleSubmit, formState, reset } = useForm<LanguageFormData>({
    resolver: zodResolver(languageSchema),
    mode: "onChange",
    defaultValues: {
      name: data?.name ?? "",
      level: data?.level ?? "Intermediate",
    },
  })

  useEffect(() => {
    if (data && open) {
      reset({
        name: data.name,
        level: data.level as any,
      })
    } else if (!data && isNew) {
      reset({
        name: "",
        level: "Intermediate",
      })
    }
  }, [data, open, isNew, reset])
  
  if (!open) return null
  
  const handleSaveLanguage = (values: LanguageFormData) => {
    onSave({
      ...data,
      ...values,
      _id: data?._id || "",
    } as Language)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isNew ? "Add Language" : "Edit Language"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSaveLanguage)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Language</Label>
              <Input placeholder="English, French, chinese..." {...register("name")} />
              {formState.errors.name && (
                <p className="text-sm text-destructive">{formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Proficiency Level</Label>
              <select
                {...register("level")}
                className="flex h-9 w-full cursor-pointer rounded-md border border-input bg-white text-background px-3 py-1 text-sm shadow-xs"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              {formState.errors.level && (
                <p className="text-sm text-destructive">{formState.errors.level.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onOpenChange}>Cancel</Button>
            <Button type="submit" disabled={loading || !formState.isValid}>{loading ? <>Saving... <Save className="h-4 w-4 ml-2 animate-bounce" /></> : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
