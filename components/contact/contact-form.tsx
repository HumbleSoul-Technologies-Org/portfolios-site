"use client"

import React from "react"

import { useState } from "react"
import { Plane, Send, SendHorizonal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { log } from "console"
import { apiRequest } from "@/lib/queryClient"

const projectTypes = [
  { value: "web", label: "Web Development" },
  { value: "mobile", label: "Mobile App" },
  { value: "backend", label: "Backend/API" },
  { value: "consulting", label: "Consulting" },
  { value: "other", label: "Other" },
]

const budgetRanges = [
  { value: "under-5k", label: "Under $5,000" },
  { value: "5k-10k", label: "$5,000 - $10,000" },
  { value: "10k-25k", label: "$10,000 - $25,000" },
  { value: "25k-50k", label: "$25,000 - $50,000" },
  { value: "50k-plus", label: "$50,000+" },
]

 interface FormData {
    name: string  
    email: string
    projectType?: string
    budget?: string
    subject: string
    message: string
  }

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
 

  const initialFormData: FormData = {
    name: "",
    email: "",
    projectType: undefined,
    budget: undefined,
    subject: "",
    message: "",
  }

  const [formData, setFormData] = useState<FormData>(initialFormData)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await apiRequest("POST", "/contact/message/create", formData)
      toast({
        title: "Message Sent",
        description: "Thank you for reaching out! I'll get back to you within 24 hours.",
      })
      setSubmitted(true)
      setFormData(initialFormData)
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
    setIsSubmitting(false)
      
    }

    
  }

  if (submitted) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <Send className="h-8 w-8 text-accent" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Message Sent!</h3>
        <p className="mt-2 text-muted-foreground">
          Thank you for reaching out. {"I'll"} get back to you within 24 hours.
        </p>
        <Button
          variant="outline"
          className="mt-6 bg-transparent"
          onClick={() => setSubmitted(false)}
        >
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="projectType">Project Type</Label>
          <Select name="projectType" required value={formData.projectType} onValueChange={(val) => setFormData((p) => ({ ...p, projectType: val }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              {projectTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="budget">Budget Range</Label>
          <Select name="budget" value={formData.budget} onValueChange={(val) => setFormData((p) => ({ ...p, budget: val }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select budget range" />
            </SelectTrigger>
            <SelectContent>
              {budgetRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          name="subject"
          placeholder="Brief description of your project"
          value={formData.subject}
          onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell me about your project, goals, and timeline..."
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
          required
        />
      </div>

      <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
        {isSubmitting ? (
          < > Sending... <SendHorizonal className="h-4 w-4 animate-bounce" /></>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Message
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        By submitting this form, you agree to be contacted regarding your inquiry.
      </p>
    </form>
  )
}
