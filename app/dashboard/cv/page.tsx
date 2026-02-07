"use client"

import { useState, useEffect } from "react"
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
  category: string
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
  level: string
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
    queryKey: ["resume","/"],
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
      } else {
         const index = experience.findIndex(exp => (exp as any)._id === data._id)
         await apiRequest("PUT", `/resume/update/${resume?._id }/${editDialog?.type}/${index}`, {experience:data})
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving experience. Please try again.",
        variant: "destructive",
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
      } else {
        const index = education.findIndex(edu => (edu as any)._id === data._id)
         await apiRequest("PUT", `/resume/update/${resume?._id }/${editDialog?.type}/${index}`, {education:data})
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving education. Please try again.",
        variant: "destructive",
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
      } else {
        const index = skills.findIndex(skill => (skill as any)._id === data._id)
         await apiRequest("PUT", `/resume/update/${resume?._id }/${editDialog?.type}/${index}`, {skill:data})
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving skills. Please try again.",
        variant: "destructive",
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
      } else {
        const index = certifications.findIndex(cert => (cert as any)._id === data._id)
         await apiRequest("PUT", `/resume/update/${resume?._id }/${editDialog?.type}/${index}`, {certification:data})
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving certifications. Please try again.",
        variant: "destructive",
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
      } else {
       
        const index = languages.findIndex(lang => (lang as any)._id === data._id)
         await apiRequest("PUT", `/resume/update/${resume?._id }/${editDialog?.type}/${index}`, {language:data})
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving languages. Please try again.",
        variant: "destructive",
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
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete item.", variant: "destructive" })
    } finally {
      setDeleting(null)
      setDeleteDialog({ type: null, id: null, name: "" })
    }
  }


  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CV Manager</h1>
          <p className="text-muted-foreground mt-1">
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
              data: {_id:"", name: "", level: "",  },
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
                    <h4 className="text-sm font-medium mb-3">{category}</h4>
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
              data: {_id:"", name: "", level: "",},
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
          // setEditDialog({ type: null, data: null, isNew: false })
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
          // setEditDialog({ type: null, data: null, isNew: false })
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
          // setEditDialog({ type: null, data: null, isNew: false })
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
          // setEditDialog({ type: null, data: null, isNew: false })
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
          // setEditDialog({ type: null, data: null, isNew: false })
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
  const [formData, setFormData] = useState<any>(data || { id: "", title: "", company: "", location: "", period: "", description: "", current: false })
  
  // Update form data when data prop changes
  useEffect(() => {
    if (data && open) {
      setFormData(data)
    }
  }, [data, open])
  
  if (!open) return null
  
  

  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isNew ? "Add Experience" : "Edit Experience"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Job Title</Label>
              <Input  value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input  value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input  value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Period</Label>
              <Input  value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })} placeholder="2023 - Present" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onOpenChange}>Cancel</Button>
          <Button onClick={() => onSave(formData)} disabled={loading}>{loading ? <>Saving... <Save className="h-4 w-4 ml-2 animate-bounce" /></> : "Save"}</Button>
        </DialogFooter>
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
  const [formData, setFormData] = useState<any>(data || { id: "", degree: "", institution: "", location: "", period: "", description: "" })
  
  // Update form data when data prop changes
  useEffect(() => {
    if (data && open) {
      setFormData(data)
    }
  }, [data, open])
  
  if (!open) return null
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isNew ? "Add Education" : "Edit Education"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Degree / Qualification</Label>
            <Input value={formData.degree} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Institution</Label>
              <Input value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Period</Label>
            <Input value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })} placeholder="2015 - 2019" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onOpenChange}>Cancel</Button>
          <Button disabled={loading} onClick={() => onSave(formData)}>{loading ? <>Saving... <Save className="h-4 w-4 ml-2 animate-bounce" /></> : "Save"}</Button>
        </DialogFooter>
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
  const [formData, setFormData] = useState<any|{}>(data || {  name: "", level: "", category: "" })
  
  // Update form data when data prop changes
  useEffect(() => {
    if (data && open) {
      setFormData(data)
    }
  }, [data, open])
  
  if (!open) return null
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isNew ? "Add Skill" : "Edit Skill"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Skill Name</Label>
            <Input className="" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="flex h-9 w-full cursor-pointer rounded-md  border-input bg-white text-background px-3 py-1 text-sm shadow-xs"
              >
                <option value="">Select a category</option>
                <option value="Technical Skills">Technical Skills</option>
                <option value="Soft Skills">Soft Skills</option>
                <option value="Professional Skills">Professional Skills</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <select 
                value={formData.level} 
                onChange={(e) => setFormData({ ...formData, level: e.target.value as Skill["level"] })}
                className="flex h-9 w-full cursor-pointer rounded-md  border-input bg-white text-background border-0 px-3 py-1 text-sm shadow-xs"
              >
                <option className="text-sm text-black cursor-pointer" value="Beginner">Beginner</option>
                <option className="text-sm text-black cursor-pointer" value="Intermediate">Intermediate</option>
                <option className="text-sm text-black cursor-pointer" value="Advanced">Advanced</option>
                <option className="text-sm text-black cursor-pointer" value="Expert">Expert</option>
              </select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onOpenChange}>Cancel</Button>
          <Button disabled={loading} onClick={() => onSave(formData)}>{loading ? <>Saving... <Save className="h-4 w-4 ml-2 animate-bounce" /></> : "Save"}</Button>
        </DialogFooter>
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
  const [formData, setFormData] = useState<any|{}>(data || {  name: "", issuer: "", date: "", url: "" })
  
  // Update form data when data prop changes
  useEffect(() => {
    if (data && open) {
      setFormData(data)
    }
  }, [data, open])
  
  if (!open) return null
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isNew ? "Add Certification" : "Edit Certification"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Certification Name</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Issuing Organization</Label>
              <Input value={formData.issuer} onChange={(e) => setFormData({ ...formData, issuer: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} placeholder="2024" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Credential URL (optional)</Label>
            <Input value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} placeholder="https://..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onOpenChange}>Cancel</Button>
          <Button disabled={loading} onClick={() => onSave(formData)}>{loading ? <>Saving... <Save className="h-4 w-4 ml-2 animate-bounce" /></> : "Save"}</Button>
        </DialogFooter>
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
  const [formData, setFormData] = useState<any|{}>(data || {  name: "", level: "" })
  
  // Update form data when data prop changes
  useEffect(() => {
    if (data && open) {
      setFormData(data)
    }
  }, [data, open])
  
  if (!open) return null
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isNew ? "Add Language" : "Edit Language"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Language</Label>
              <Input placeholder="English, French, chinese..." value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Proficiency Level</Label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="flex h-9 w-full cursor-pointer rounded-md border border-input bg-white text-background px-3 py-1 text-sm shadow-xs"
              >
                <option value="">Select a level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onOpenChange}>Cancel</Button>
          <Button disabled={loading} onClick={() => onSave(formData)}>{loading ? <>Saving... <Save className="h-4 w-4 ml-2 animate-bounce" /></> : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
