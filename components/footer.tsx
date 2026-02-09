"use client"

import Link from "next/link"
import { Github, Linkedin, Mail, Twitter } from "lucide-react"
import { useAuth } from "@/lib/useAuth"

const socialLinks = [
  { href: "https://github.com/GamingHazard", icon: Github, label: "GitHub" },
  { href: "https://www.linkedin.com/in/kisibo-jonathan-3699ab33b?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BCIq%2FdIhVQVuF9UgUr%2F54Ow%3D%3D", icon: Linkedin, label: "LinkedIn" },
  // { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
  { href: "mailto:kisibojonathan150@gmail.com", icon: Mail, label: "Email" },
]

const footerLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]


export function Footer() {
  const { user } = useAuth()
  return (
    <footer className="border-t border-border/40 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="flex flex-col items-center gap-4 md:items-start">
            <Link 
              href="/" 
              className="text-xl flex items-center gap-2 font-semibold tracking-tight text-foreground"
            >
          <img className="w-10 h-10" src='https://images.vexels.com/media/users/3/224169/isolated/lists/dbfe1f493ad01117fa4ec5ba10150e4d-computer-programming-logo.png'/>
          <span className="text-transparent bg-clip-text bg-linear-to-r from-accent   to-orange-500" >{user?.name.toUpperCase() || "KISIBO JONATHAN"}</span>
              
            </Link>
            <p className="max-w-xs text-center text-sm text-muted-foreground md:text-left">
              Full-stack developer crafting digital experiences that matter.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} Kisibo Jonathan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
