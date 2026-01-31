"use client"

import { useState } from "react"
import { 
  Search, 
  Mail, 
  MailOpen,
  Trash2,
  Archive,
  Star,
  StarOff,
  Reply,
  MoreHorizontal,
  ChevronLeft,
  Clock,
  User,
  Building,
  DollarSign,
  Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
import { cn } from "@/lib/utils"

interface Message {
  id: string
  name: string
  email: string
  company?: string
  subject: string
  message: string
  projectType?: string
  budget?: string
  timestamp: string
  read: boolean
  starred: boolean
  archived: boolean
}

const initialMessages: Message[] = [
  {
    id: "1",
    name: "Sarah Thompson",
    email: "sarah@techstartup.io",
    company: "TechStartup.io",
    subject: "Website Redesign Project",
    message: "Hi! We're a growing startup looking to redesign our company website. We need a modern, responsive design that better reflects our brand and improves conversion rates. Our current site is outdated and doesn't perform well on mobile devices. We're looking for someone who can handle both the design and development aspects. Would love to discuss this further if you're available.",
    projectType: "Web Development",
    budget: "$10,000 - $25,000",
    timestamp: "2 hours ago",
    read: false,
    starred: true,
    archived: false,
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@innovate.com",
    company: "Innovate Labs",
    subject: "Mobile App Development",
    message: "Hello, I came across your portfolio and was impressed by your mobile app work. We're building a fitness tracking app and need a skilled developer to bring our vision to life. The app should work on both iOS and Android. We have wireframes ready and would like to start development ASAP. Can you share your availability and rough timeline for a project like this?",
    projectType: "Mobile Development",
    budget: "$25,000 - $50,000",
    timestamp: "5 hours ago",
    read: false,
    starred: false,
    archived: false,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@boutique.co",
    company: "Boutique Co",
    subject: "E-commerce Platform Inquiry",
    message: "Hi there! I run a small boutique and we're looking to expand our online presence. We need a custom e-commerce solution that can handle inventory management, payment processing, and integrates with our existing POS system. I've seen your e-commerce project in your portfolio and it looks exactly like what we need. What's your process for starting a new project?",
    projectType: "E-commerce",
    budget: "$15,000 - $30,000",
    timestamp: "1 day ago",
    read: false,
    starred: false,
    archived: false,
  },
  {
    id: "4",
    name: "David Kim",
    email: "david@enterprise.com",
    company: "Enterprise Solutions",
    subject: "Re: Project Timeline",
    message: "Thanks for the detailed proposal. The timeline looks good to us. I've discussed it with my team and we're ready to move forward. Can we schedule a kickoff call for next week? Also, please send over the contract so our legal team can review it. Looking forward to working together!",
    projectType: "Consulting",
    budget: "$5,000 - $10,000",
    timestamp: "2 days ago",
    read: true,
    starred: true,
    archived: false,
  },
  {
    id: "5",
    name: "Lisa Wang",
    email: "lisa@designagency.com",
    company: "Design Agency Pro",
    subject: "Partnership Opportunity",
    message: "Hello! I'm reaching out from Design Agency Pro. We're looking for skilled developers to partner with on overflow projects. We have several clients who need development work but our in-house team is at capacity. Would you be interested in discussing a potential partnership? We can provide a steady stream of projects.",
    projectType: "Other",
    timestamp: "3 days ago",
    read: true,
    starred: false,
    archived: false,
  },
  {
    id: "6",
    name: "James Wilson",
    email: "jwilson@healthcare.org",
    subject: "Healthcare App Consultation",
    message: "We're a healthcare organization looking to build a patient portal. Given the sensitive nature of the data, we need someone experienced with HIPAA compliance. I saw your healthcare dashboard project and would like to discuss our requirements. Are you available for a consultation call this week?",
    projectType: "Healthcare",
    budget: "$50,000+",
    timestamp: "4 days ago",
    read: true,
    starred: false,
    archived: false,
  },
]

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [filter, setFilter] = useState<"all" | "unread" | "starred" | "archived">("all")
  const [deleteDialog, setDeleteDialog] = useState<Message | null>(null)
  const [replyDialog, setReplyDialog] = useState<Message | null>(null)
  const [replyText, setReplyText] = useState("")

  const filteredMessages = messages.filter((message) => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    switch (filter) {
      case "unread":
        return matchesSearch && !message.read && !message.archived
      case "starred":
        return matchesSearch && message.starred && !message.archived
      case "archived":
        return matchesSearch && message.archived
      default:
        return matchesSearch && !message.archived
    }
  })

  const unreadCount = messages.filter(m => !m.read && !m.archived).length

  const handleMarkAsRead = (id: string) => {
    setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m))
  }

  const handleToggleStar = (id: string) => {
    setMessages(messages.map(m => m.id === id ? { ...m, starred: !m.starred } : m))
  }

  const handleArchive = (id: string) => {
    setMessages(messages.map(m => m.id === id ? { ...m, archived: true } : m))
    if (selectedMessage?.id === id) setSelectedMessage(null)
  }

  const handleDelete = () => {
    if (deleteDialog) {
      setMessages(messages.filter(m => m.id !== deleteDialog.id))
      if (selectedMessage?.id === deleteDialog.id) setSelectedMessage(null)
      setDeleteDialog(null)
    }
  }

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message)
    if (!message.read) {
      handleMarkAsRead(message.id)
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] lg:h-screen">
      {/* Message List */}
      <div className={cn(
        "flex flex-col border-r border-border w-full lg:w-96",
        selectedMessage && "hidden lg:flex"
      )}>
        {/* List Header */}
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Messages</h1>
            {unreadCount > 0 && (
              <Badge>{unreadCount} unread</Badge>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-1">
            {(["all", "unread", "starred", "archived"] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(f)}
                className="capitalize"
              >
                {f}
              </Button>
            ))}
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto">
          {filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <Mail className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No messages found</p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <button
                key={message.id}
                onClick={() => handleSelectMessage(message)}
                className={cn(
                  "w-full text-left p-4 border-b border-border hover:bg-muted/50 transition-colors",
                  selectedMessage?.id === message.id && "bg-muted",
                  !message.read && "bg-accent/5"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "mt-2 h-2 w-2 rounded-full shrink-0",
                    message.read ? "bg-transparent" : "bg-accent"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={cn(
                        "text-sm truncate",
                        !message.read && "font-semibold"
                      )}>
                        {message.name}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        {message.starred && <Star className="h-3 w-3 fill-accent text-accent" />}
                        <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                      </div>
                    </div>
                    <p className={cn(
                      "text-sm truncate mb-1",
                      !message.read ? "font-medium" : "text-muted-foreground"
                    )}>
                      {message.subject}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {message.message}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Message Detail */}
      <div className={cn(
        "flex-1 flex flex-col",
        !selectedMessage && "hidden lg:flex"
      )}>
        {selectedMessage ? (
          <>
            {/* Detail Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSelectedMessage(null)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h2 className="font-semibold">{selectedMessage.subject}</h2>
                  <p className="text-sm text-muted-foreground">From: {selectedMessage.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleStar(selectedMessage.id)}
                >
                  {selectedMessage.starred ? (
                    <Star className="h-4 w-4 fill-accent text-accent" />
                  ) : (
                    <StarOff className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setReplyDialog(selectedMessage)}
                >
                  <Reply className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleMarkAsRead(selectedMessage.id)}>
                      <MailOpen className="h-4 w-4 mr-2" />
                      Mark as {selectedMessage.read ? "unread" : "read"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleArchive(selectedMessage.id)}>
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={() => setDeleteDialog(selectedMessage)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Message Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Sender Info */}
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-border">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-semibold">
                  {selectedMessage.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedMessage.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {selectedMessage.timestamp}
                    </span>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              {(selectedMessage.company || selectedMessage.projectType || selectedMessage.budget) && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6 p-4 rounded-lg bg-muted/50">
                  {selectedMessage.company && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Company</p>
                        <p className="text-sm font-medium">{selectedMessage.company}</p>
                      </div>
                    </div>
                  )}
                  {selectedMessage.projectType && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Project Type</p>
                        <p className="text-sm font-medium">{selectedMessage.projectType}</p>
                      </div>
                    </div>
                  )}
                  {selectedMessage.budget && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="text-sm font-medium">{selectedMessage.budget}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Message Body */}
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            {/* Quick Reply */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input 
                  placeholder="Write a quick reply..." 
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      setReplyDialog(selectedMessage)
                    }
                  }}
                />
                <Button onClick={() => setReplyDialog(selectedMessage)}>
                  <Reply className="h-4 w-4 mr-2" />
                  Reply
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <Mail className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-1">No message selected</h3>
            <p className="text-muted-foreground">Select a message to view its contents</p>
          </div>
        )}
      </div>

      {/* Reply Dialog */}
      <Dialog open={!!replyDialog} onOpenChange={() => { setReplyDialog(null); setReplyText("") }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reply to {replyDialog?.name}</DialogTitle>
            <DialogDescription>
              Re: {replyDialog?.subject}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">To: {replyDialog?.email}</p>
            </div>
            <Textarea
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={8}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setReplyDialog(null); setReplyText("") }}>
              Cancel
            </Button>
            <Button onClick={() => {
              // In a real app, this would send the email
              setReplyDialog(null)
              setReplyText("")
            }}>
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message from {deleteDialog?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
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
