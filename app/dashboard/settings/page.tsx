"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Camera,
  Bell,
  Shield,
  Palette
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from "axios"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useAuth } from "@/lib/useAuth"

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  title: z.string().optional(),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
})

const socialSchema = z.object({
  github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
  instagram: z.string().url("Invalid Instagram URL").optional().or(z.literal("")),
})

type ProfileFormData = z.infer<typeof profileSchema>
type SocialFormData = z.infer<typeof socialSchema>

interface ProfileSettings {
  name: string
  title: string
  email: string
  phone: string
  location: string
  website: string
  bio: string
  avatar: string
}

interface SocialLinks {
  github: string
  linkedin: string
  twitter: string
  instagram: string
}

interface NotificationSettings {
  emailNotifications: boolean
  newMessages: boolean
  projectUpdates: boolean
  weeklyDigest: boolean
  marketingEmails: boolean
}

interface DisplaySettings {
  theme: "light" | "dark" | "system"
  showAvailability: boolean
  showEmail: boolean
  showPhone: boolean
}

export default function SettingsPage() {
  const { user } = useAuth()
  
  // Profile form
  const { register: registerProfile, handleSubmit: handleSubmitProfile, control: controlProfile, formState: formStateProfile, watch: watchProfile } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      name: user?.name || "",
      title: user?.title || "",
      email: user?.email || "",
      phone: user?.phone || "",
      location: user?.address || "",
      website: user?.website || "",
      bio: user?.bio || "",
    },
  })

  const profileName = watchProfile("name")
  const profileBio = watchProfile("bio")

  // Social form
  const { register: registerSocial, handleSubmit: handleSubmitSocial, control: controlSocial, formState: formStateSocial } = useForm<SocialFormData>({
    resolver: zodResolver(socialSchema),
    mode: "onChange",
    defaultValues: {
      github: "",
      linkedin: "",
      twitter: "",
      instagram: "",
    },
  })

  const [profile, setProfile] = useState({
    avatar: user?.avatarUrl?.url || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzR0bIMZ71HVeR5zF4PihQaDvTQQk6bsVERw&s",
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    newMessages: true,
    projectUpdates: true,
    weeklyDigest: false,
    marketingEmails: false,
  })

  const [display, setDisplay] = useState<DisplaySettings>({
    theme: "system",
    showAvailability: true,
    showEmail: true,
    showPhone: false,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSaveProfile = async (values: ProfileFormData) => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveSocial = async (values: SocialFormData) => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
    } finally {
      setIsSaving(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight animate-fade-in [animation-delay:50ms]">Settings</h1>
          <p className="text-muted-foreground mt-1 animate-fade-in [animation-delay:100ms]">
            Manage your profile and preferences
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2">
            <Globe className="h-4 w-4" />
            Social
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="display" className="gap-2">
            <Palette className="h-4 w-4" />
            Display
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          {/* Avatar Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>This will be displayed on your portfolio and contact page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    {profileName?.split(" ").map(n => n?.[0]).join("") || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Recommended: Square image, at least 400x400px
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitProfile(handleSaveProfile)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                      placeholder="Enter your full name"
                        id="name"
                        {...registerProfile("name")}
                        className="pl-9"
                      />
                    </div>
                    {formStateProfile.errors.name && (
                      <p className="text-sm text-destructive">{formStateProfile.errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input 
                      id="title"
                      {...registerProfile("title")}
                      placeholder="e.g., Full-Stack Developer"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                      placeholder="Enter your email address"
                        id="email"
                        type="email"
                        {...registerProfile("email")}
                        className="pl-9"
                      />
                    </div>
                    {formStateProfile.errors.email && (
                      <p className="text-sm text-destructive">{formStateProfile.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                      placeholder="Enter your phone number"
                        id="phone"
                        type="tel"
                        {...registerProfile("phone")}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                      placeholder="Enter your location"
                        id="location"
                        {...registerProfile("location")}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                      placeholder="Enter your website URL"
                        id="website"
                        type="url"
                        {...registerProfile("website")}
                        className="pl-9"
                      />
                    </div>
                    {formStateProfile.errors.website && (
                      <p className="text-sm text-destructive">{formStateProfile.errors.website.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    {...registerProfile("bio")}
                    rows={4}
                    placeholder="Tell visitors about yourself..."
                  />
                  <p className="text-xs text-muted-foreground">
                    {profileBio?.length || 0}/500 characters
                  </p>
                  {formStateProfile.errors.bio && (
                    <p className="text-sm text-destructive">{formStateProfile.errors.bio.message}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={isSaving || !formStateProfile.isValid}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Profile"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>Connect your social media profiles</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitSocial(handleSaveSocial)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="github"
                      type="url"
                      {...registerSocial("github")}
                      className="pl-9"
                      placeholder="https://github.com/username"
                    />
                  </div>
                  {formStateSocial.errors.github && (
                    <p className="text-sm text-destructive">{formStateSocial.errors.github.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="linkedin"
                      type="url"
                      {...registerSocial("linkedin")}
                      className="pl-9"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  {formStateSocial.errors.linkedin && (
                    <p className="text-sm text-destructive">{formStateSocial.errors.linkedin.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter / X</Label>
                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="twitter"
                      type="url"
                      {...registerSocial("twitter")}
                      className="pl-9"
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                  {formStateSocial.errors.twitter && (
                    <p className="text-sm text-destructive">{formStateSocial.errors.twitter.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="instagram"
                      type="url"
                      {...registerSocial("instagram")}
                      className="pl-9"
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                  {formStateSocial.errors.instagram && (
                    <p className="text-sm text-destructive">{formStateSocial.errors.instagram.message}</p>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={isSaving || !formStateSocial.isValid}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Social Links"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Choose what emails you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for important updates
                  </p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, emailNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when you receive new contact form submissions
                  </p>
                </div>
                <Switch
                  checked={notifications.newMessages}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, newMessages: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Project Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about your active projects
                  </p>
                </div>
                <Switch
                  checked={notifications.projectUpdates}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, projectUpdates: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Get a weekly summary of your portfolio activity
                  </p>
                </div>
                <Switch
                  checked={notifications.weeklyDigest}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, weeklyDigest: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive tips and updates about new features
                  </p>
                </div>
                <Switch
                  checked={notifications.marketingEmails}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, marketingEmails: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Tab */}
        <TabsContent value="display" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how your dashboard looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select
                  value={display.theme}
                  onValueChange={(value: "light" | "dark" | "system") => 
                    setDisplay({ ...display, theme: value })
                  }
                >
                  <SelectTrigger className="w-full sm:w-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Select your preferred color scheme
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
              <CardDescription>Control what information is visible on your portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Availability Badge</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your availability status on your portfolio
                  </p>
                </div>
                <Switch
                  checked={display.showAvailability}
                  onCheckedChange={(checked) => 
                    setDisplay({ ...display, showAvailability: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Email Address</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your email visible on the contact page
                  </p>
                </div>
                <Switch
                  checked={display.showEmail}
                  onCheckedChange={(checked) => 
                    setDisplay({ ...display, showEmail: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Phone Number</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your phone number visible on the contact page
                  </p>
                </div>
                <Switch
                  checked={display.showPhone}
                  onCheckedChange={(checked) => 
                    setDisplay({ ...display, showPhone: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                <div>
                  <p className="font-medium text-destructive">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
