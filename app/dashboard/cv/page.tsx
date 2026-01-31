"use client"

import { useState } from "react"
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
  Download
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

interface Experience {
  id: string
  title: string
  company: string
  location: string
  period: string
  description: string
  current: boolean
}

interface Education {
  id: string
  degree: string
  institution: string
  location: string
  period: string
  description: string
}

interface Skill {
  id: string
  name: string
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  category: string
}

interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  url?: string
}

interface Language {
  id: string
  name: string
  level: string
}

const initialExperience: Experience[] = [
  {
    id: "1",
    title: "Senior Full-Stack Developer",
    company: "Tech Solutions Inc.",
    location: "San Francisco, CA",
    period: "2023 - Present",
    description: "Leading development of enterprise web applications. Mentoring junior developers and implementing best practices.",
    current: true,
  },
  {
    id: "2",
    title: "Full-Stack Developer",
    company: "Digital Agency Co.",
    location: "New York, NY",
    period: "2021 - 2023",
    description: "Developed responsive web applications and mobile apps for various clients across different industries.",
    current: false,
  },
  {
    id: "3",
    title: "Junior Developer",
    company: "StartupXYZ",
    location: "Austin, TX",
    period: "2019 - 2021",
    description: "Built and maintained web applications using React and Node.js. Collaborated with design team on UI/UX implementations.",
    current: false,
  },
]

const initialEducation: Education[] = [
  {
    id: "1",
    degree: "Bachelor of Science in Information Technology",
    institution: "University of Technology",
    location: "San Francisco, CA",
    period: "2015 - 2019",
    description: "Specialized in Web Development, Mobile Apps, and System/Software Development.",
  },
]

const initialSkills: Skill[] = [
  { id: "1", name: "React", level: "Expert", category: "Frontend" },
  { id: "2", name: "Next.js", level: "Expert", category: "Frontend" },
  { id: "3", name: "TypeScript", level: "Advanced", category: "Languages" },
  { id: "4", name: "Node.js", level: "Advanced", category: "Backend" },
  { id: "5", name: "PostgreSQL", level: "Advanced", category: "Database" },
  { id: "6", name: "React Native", level: "Intermediate", category: "Mobile" },
  { id: "7", name: "Python", level: "Intermediate", category: "Languages" },
  { id: "8", name: "AWS", level: "Intermediate", category: "DevOps" },
]

const initialCertifications: Certification[] = [
  { id: "1", name: "AWS Certified Developer", issuer: "Amazon Web Services", date: "2024" },
  { id: "2", name: "Meta React Developer", issuer: "Meta", date: "2023" },
]

const initialLanguages: Language[] = [
  { id: "1", name: "English", level: "Native" },
  { id: "2", name: "Spanish", level: "Intermediate" },
]

export default function CVManagementPage() {
  const [experience, setExperience] = useState<Experience[]>(initialExperience)
  const [education, setEducation] = useState<Education[]>(initialEducation)
  const [skills, setSkills] = useState<Skill[]>(initialSkills)
  const [certifications, setCertifications] = useState<Certification[]>(initialCertifications)
  const [languages, setLanguages] = useState<Language[]>(initialLanguages)
  
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

  const handleDelete = () => {
    if (!deleteDialog.type || !deleteDialog.id) return
    
    switch (deleteDialog.type) {
      case "experience":
        setExperience(experience.filter(e => e.id !== deleteDialog.id))
        break
      case "education":
        setEducation(education.filter(e => e.id !== deleteDialog.id))
        break
      case "skill":
        setSkills(skills.filter(s => s.id !== deleteDialog.id))
        break
      case "certification":
        setCertifications(certifications.filter(c => c.id !== deleteDialog.id))
        break
      case "language":
        setLanguages(languages.filter(l => l.id !== deleteDialog.id))
        break
    }
    setDeleteDialog({ type: null, id: null, name: "" })
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Expert": return "bg-accent text-accent-foreground"
      case "Advanced": return "bg-primary text-primary-foreground"
      case "Intermediate": return "bg-secondary text-secondary-foreground"
      default: return "bg-muted text-muted-foreground"
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
              data: { id: "", title: "", company: "", location: "", period: "", description: "", current: false },
              isNew: true 
            })}>
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </div>
          <div className="space-y-4">
            {experience.map((exp) => (
              <Card key={exp.id} className="group">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="hidden sm:flex mt-1 text-muted-foreground cursor-grab">
                      <GripVertical className="h-5 w-5" />
                    </div>
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
                        onClick={() => setDeleteDialog({ type: "experience", id: exp.id, name: exp.title })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setEditDialog({ 
              type: "education", 
              data: { id: "", degree: "", institution: "", location: "", period: "", description: "" },
              isNew: true 
            })}>
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </div>
          <div className="space-y-4">
            {education.map((edu) => (
              <Card key={edu.id} className="group">
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
                        onClick={() => setDeleteDialog({ type: "education", id: edu.id, name: edu.degree })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setEditDialog({ 
              type: "skill", 
              data: { id: "", name: "", level: "Intermediate", category: "Frontend" },
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
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(
                  skills.reduce((acc, skill) => {
                    if (!acc[skill.category]) acc[skill.category] = []
                    acc[skill.category].push(skill)
                    return acc
                  }, {} as Record<string, Skill[]>)
                ).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium mb-3">{category}</h4>
                    <div className="space-y-2">
                      {categorySkills.map((skill) => (
                        <div 
                          key={skill.id} 
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
                                onClick={() => setDeleteDialog({ type: "skill", id: skill.id, name: skill.name })}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setEditDialog({ 
              type: "certification", 
              data: { id: "", name: "", issuer: "", date: "", url: "" },
              isNew: true 
            })}>
              <Plus className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {certifications.map((cert) => (
              <Card key={cert.id} className="group">
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
                        onClick={() => setDeleteDialog({ type: "certification", id: cert.id, name: cert.name })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Languages Tab */}
        <TabsContent value="languages" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setEditDialog({ 
              type: "language", 
              data: { id: "", name: "", level: "" },
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
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {languages.map((lang) => (
                  <div 
                    key={lang.id} 
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
                        onClick={() => setDeleteDialog({ type: "language", id: lang.id, name: lang.name })}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
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
          if (editDialog.isNew) {
            setExperience([{ ...data, id: Date.now().toString() }, ...experience])
          } else {
            setExperience(experience.map(e => e.id === data.id ? data : e))
          }
          setEditDialog({ type: null, data: null, isNew: false })
        }}
      />

      <EducationDialog
        open={editDialog.type === "education"}
        onOpenChange={() => setEditDialog({ type: null, data: null, isNew: false })}
        data={editDialog.data as Education}
        isNew={editDialog.isNew}
        onSave={(data) => {
          if (editDialog.isNew) {
            setEducation([{ ...data, id: Date.now().toString() }, ...education])
          } else {
            setEducation(education.map(e => e.id === data.id ? data : e))
          }
          setEditDialog({ type: null, data: null, isNew: false })
        }}
      />

      <SkillDialog
        open={editDialog.type === "skill"}
        onOpenChange={() => setEditDialog({ type: null, data: null, isNew: false })}
        data={editDialog.data as Skill}
        isNew={editDialog.isNew}
        onSave={(data) => {
          if (editDialog.isNew) {
            setSkills([...skills, { ...data, id: Date.now().toString() }])
          } else {
            setSkills(skills.map(s => s.id === data.id ? data : s))
          }
          setEditDialog({ type: null, data: null, isNew: false })
        }}
      />

      <CertificationDialog
        open={editDialog.type === "certification"}
        onOpenChange={() => setEditDialog({ type: null, data: null, isNew: false })}
        data={editDialog.data as Certification}
        isNew={editDialog.isNew}
        onSave={(data) => {
          if (editDialog.isNew) {
            setCertifications([...certifications, { ...data, id: Date.now().toString() }])
          } else {
            setCertifications(certifications.map(c => c.id === data.id ? data : c))
          }
          setEditDialog({ type: null, data: null, isNew: false })
        }}
      />

      <LanguageDialog
        open={editDialog.type === "language"}
        onOpenChange={() => setEditDialog({ type: null, data: null, isNew: false })}
        data={editDialog.data as Language}
        isNew={editDialog.isNew}
        onSave={(data) => {
          if (editDialog.isNew) {
            setLanguages([...languages, { ...data, id: Date.now().toString() }])
          } else {
            setLanguages(languages.map(l => l.id === data.id ? data : l))
          }
          setEditDialog({ type: null, data: null, isNew: false })
        }}
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
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Dialog Components
function ExperienceDialog({ open, onOpenChange, data, isNew, onSave }: {
  open: boolean
  onOpenChange: () => void
  data: Experience | null
  isNew: boolean
  onSave: (data: Experience) => void
}) {
  const [formData, setFormData] = useState<Experience>(data || { id: "", title: "", company: "", location: "", period: "", description: "", current: false })
  
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
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Period</Label>
              <Input value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })} placeholder="2023 - Present" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onOpenChange}>Cancel</Button>
          <Button onClick={() => onSave(formData)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EducationDialog({ open, onOpenChange, data, isNew, onSave }: {
  open: boolean
  onOpenChange: () => void
  data: Education | null
  isNew: boolean
  onSave: (data: Education) => void
}) {
  const [formData, setFormData] = useState<Education>(data || { id: "", degree: "", institution: "", location: "", period: "", description: "" })
  
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
          <Button onClick={() => onSave(formData)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function SkillDialog({ open, onOpenChange, data, isNew, onSave }: {
  open: boolean
  onOpenChange: () => void
  data: Skill | null
  isNew: boolean
  onSave: (data: Skill) => void
}) {
  const [formData, setFormData] = useState<Skill>(data || { id: "", name: "", level: "Intermediate", category: "Frontend" })
  
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
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Frontend, Backend, etc." />
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <select 
                value={formData.level} 
                onChange={(e) => setFormData({ ...formData, level: e.target.value as Skill["level"] })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
              >
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
          <Button onClick={() => onSave(formData)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CertificationDialog({ open, onOpenChange, data, isNew, onSave }: {
  open: boolean
  onOpenChange: () => void
  data: Certification | null
  isNew: boolean
  onSave: (data: Certification) => void
}) {
  const [formData, setFormData] = useState<Certification>(data || { id: "", name: "", issuer: "", date: "", url: "" })
  
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
          <Button onClick={() => onSave(formData)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function LanguageDialog({ open, onOpenChange, data, isNew, onSave }: {
  open: boolean
  onOpenChange: () => void
  data: Language | null
  isNew: boolean
  onSave: (data: Language) => void
}) {
  const [formData, setFormData] = useState<Language>(data || { id: "", name: "", level: "" })
  
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
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Proficiency Level</Label>
              <Input value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} placeholder="Native, Fluent, Intermediate..." />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onOpenChange}>Cancel</Button>
          <Button onClick={() => onSave(formData)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
