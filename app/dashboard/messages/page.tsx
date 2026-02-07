"use client"

import { useState,useEffect } from "react"
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
  Calendar,
  ArchiveRestore,
  SendHorizonal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useQuery } from "@tanstack/react-query"
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
import { log } from "console"
import { apiRequest } from "@/lib/queryClient"
import { toast } from "@/hooks/use-toast"

interface Message {
  _id: string
  name: string
  email: string
  company?: string
  subject: string
  message: string
  projectType?: string
  budget?: string
  createdAt: string
  read: boolean
  starred: boolean
  archived: boolean
  reply?: {
    reply: string
    date?: string
  }
}

interface Reply {
  _id: string
  messageId: string
  senderName: string
  senderEmail: string
  text: string
  createdAt: string
}

 
export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [filter, setFilter] = useState<"new" | "read" | "starred" | "archived">("new")
  const [deleteDialog, setDeleteDialog] = useState<Message | null>(null)
  const [replyDialog, setReplyDialog] = useState<Message | null>(null)
  const [replyText, setReplyText] = useState("")
  const [sending, setSending] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [replies, setReplies] = useState<Reply[]>([])

  const { data:allMessages, isLoading, error } = useQuery<any>({
    queryKey: ["contact","messages","all"],
  })

  useEffect(() => {
    if (allMessages) {
      setMessages(allMessages?.data?.messages || [])
      
    }
   }, [allMessages])



  const filteredMessages = messages.filter((message) => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    switch (filter) {
      case "read":
        return matchesSearch && message.read && !message.archived && !message.starred
      case "starred":
        return matchesSearch && message.starred && !message.archived && message.read
      case "archived":
        return matchesSearch && message.archived
      default:
        return matchesSearch && !message.archived && !message.read 
    }
  })

  const unreadCount = messages.filter(m => !m.read && !m.archived).length

  function formatDate(dateStr: string) {
    // If the date is already a human readable string, leave it as-is
    const parsed = Date.parse(dateStr)
    if (isNaN(parsed)) return dateStr

    const date = new Date(parsed)
    const now = new Date()
    const diffSeconds = Math.round((date.getTime() - now.getTime()) / 1000)
    const abs = Math.abs(diffSeconds)
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" })

    if (abs < 60) return rtf.format(Math.round(diffSeconds), "second")
    if (abs < 3600) return rtf.format(Math.round(diffSeconds / 60), "minute")
    if (abs < 86400) return rtf.format(Math.round(diffSeconds / 3600), "hour")
    if (abs < 7 * 86400) return rtf.format(Math.round(diffSeconds / 86400), "day")

    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date)
  }

  function formatDateLong(dateStr: string) {
    const parsed = Date.parse(dateStr)
    if (isNaN(parsed)) return dateStr
    const date = new Date(parsed)
    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    }).format(date)
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiRequest("POST", `/contact/message/read/${id}`)
      setMessages(messages.map(m => m._id === id ? { ...m, read: true } : m))
    } catch (error) {
      
    }
    // setMessages(messages.map(m => m._id === id ? { ...m, read: true } : m))
  }

  const handleToggleStar = async (id: string) => {
    try {
      await apiRequest("POST", `/contact/message/star/${id}`)
      setSelectedMessage(m => m && m._id === id ? { ...m, starred: !m.starred } : m)
      setMessages(messages.map(m => m._id === id ? { ...m, starred: !m.starred } : m))
      toast({
        title: "Success",
        description: "Message added to favourites ",
      })
    } catch (error) {
      
      toast({
        title: "Error",
        description: "Failed to star message. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleArchive = async (id: string) => {
    try {
      await apiRequest("POST", `/contact/message/archive/${id}`)
      setMessages(messages.map(m => m._id === id ? { ...m, archived: true } : m))
      if (selectedMessage?._id === id) setSelectedMessage(null)
      toast({
        title: "Success",
        description: "Message archived.",
      })
    } catch (error) {
      
      toast({
        title: "Error",
        description: "Failed to archive message. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id:string) => {
    try {
      setIsDeleting(true)
      await apiRequest("DELETE", `/contact/delete/message/${id}`)
      setMessages(messages.filter(m => m._id !== id))
      if (selectedMessage?._id === id) setSelectedMessage(null)
      setDeleteDialog(null)
      toast({
        title: "Success",
        description: "Message deleted successfully.",
      })
    } catch (error) {
      console.log('====================================' )
      console.log(error)
      console.log('====================================' )
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message)
    setReplies([])
    if (!message.read) {
      handleMarkAsRead(message._id)
    }
  }

  const handleReply = async (id: string) => {
    try {
      setSending(true)

      const data = {
        reply: replyText,
        to: selectedMessage?.email,
        from:selectedMessage?.name,
      }
      await apiRequest("POST", `/contact/message/reply/${id}`, data)
      setSelectedMessage(m => m && m._id === id ? { ...m, reply: { reply: replyText, senderName: "Me", senderEmail: m.email } } : m)
      toast({
        title: "Success",
        description: "Reply sent successfully.",
      })
      setReplyText("")
      setReplyDialog(null)
    } catch (error) {
       
    } finally { 
      setSending(false)
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
            {(["new", "read", "starred", "archived"] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(f)}
                className="capitalize"
              >
                {f}
                {f === "new" && messages.filter(m => !m.read && !m.archived).length > 0 && (<p className="text-accent">{messages.filter(m => !m.read && !m.archived).length}</p>)}  
                {f === "read" && messages.filter(m => m.read && !m.archived && !m.starred).length > 0 && (<p className="text-accent">{messages.filter(m => m.read && !m.archived && !m.starred).length}</p>)}  
                {f === "starred" && messages.filter(m => m.starred && !m.archived).length > 0 && (<p className="text-accent">{messages.filter(m => m.starred && !m.archived).length}</p>)}  
                {f === "archived" && messages.filter(m => m.archived).length > 0 && (<p className="text-accent">{messages.filter(m => m.archived).length}</p>)}  
                 
              </Button>
            ))}
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto">
          {filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <Mail className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No {filter} messages found</p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <button
                key={message._id}
                onClick={() => handleSelectMessage(message)}
                className={cn(
                  "w-full text-left p-4 border-b border-border hover:bg-muted/50 transition-colors",
                  selectedMessage?._id === message._id && "bg-muted",
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
                        <span className="text-xs text-muted-foreground">{formatDate(message.createdAt)}</span>
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
                  onClick={() => handleToggleStar(selectedMessage._id)}
                >
                   <Star className={`h-4 w-4 ${!!selectedMessage.starred ? "fill-accent text-accent" : "text-muted-foreground"}`} />
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
                    
                    <DropdownMenuItem onClick={() => handleArchive(selectedMessage._id)}>
                     {selectedMessage.archived ? (<><ArchiveRestore className="h-4 w-4 mr-2" /> Unarchive</>) : (<><Archive className="h-4 w-4 mr-2" /> Archive</>)}
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
                      {formatDate(selectedMessage.createdAt)}
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

              {/* Replies Section */}
             
            </div>

            {/* Quick Reply */}
            <div className="p-4 border-t border-border">
                 {/* Replies Section */}
              {!!selectedMessage.reply  && (
                <div className="mb-6 pb-6 border-b border-border">
                 <span className="text-sm text-muted-foreground font-semibold mb-4">Previous Reply:</span>
                  <span
                    className="text-sm text-muted-foreground font-semibold mb-4"
                    title={formatDateLong(selectedMessage.reply?.date || "")}
                    aria-label={formatDateLong(selectedMessage.reply?.date || "")}
                  >
                    {formatDate(selectedMessage.reply?.date || "")}
                  </span>
                  <div className="space-y-4 text-sm">
                    {selectedMessage.reply.reply}
                  </div>
                </div>
              )}
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
            <Button disabled={sending} onClick={() => {
              
              handleReply(replyDialog!._id)
            }}>
             {sending ?  <>Sending...<SendHorizonal className="h-4 w-4 ml-2 animate-bounce" /></> : "Send Reply"}
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
            <Button 
              disabled={isDeleting}
              className="cursor-pointer  hover:bg-red-600 hover:text-white" 
              variant="destructive" 
              onClick={() => {
                handleDelete(deleteDialog!._id)
              }}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
