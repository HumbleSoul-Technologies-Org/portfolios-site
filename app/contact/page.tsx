import { Metadata } from "next"
import { Calendar, Clock, Github, Linkedin, Mail, MapPin, MessageSquare, Twitter } from "lucide-react"
import { ContactForm } from "@/components/contact/contact-form"

export const metadata: Metadata = {
  title: "Contact | Your Name",
  description: "Get in touch for project inquiries, collaborations, or just to say hello.",
}

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@example.com",
    href: "mailto:hello@example.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "San Francisco, CA",
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "Within 24 hours",
  },
  {
    icon: Calendar,
    label: "Availability",
    value: "Open for new projects",
  },
]

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
]

const faqs = [
  {
    question: "What's your typical project timeline?",
    answer: "Most projects take 4-12 weeks depending on complexity. I'll provide a detailed timeline during our initial consultation.",
  },
  {
    question: "Do you work with international clients?",
    answer: "Yes! I work with clients worldwide and am flexible with time zones for meetings and communication.",
  },
  {
    question: "What's your payment structure?",
    answer: "I typically work with a 50% upfront deposit and 50% upon project completion. For larger projects, we can arrange milestone-based payments.",
  },
  {
    question: "Can you work with existing codebases?",
    answer: "Absolutely. I regularly work on enhancing existing applications, adding features, and improving performance.",
  },
]

export default function ContactPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Page Header */}
        <div className="mb-16 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-accent">
            Contact
          </p>
          <h1 className="mt-2 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {"Let's"} Work Together
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Have a project in mind? {"I'd"} love to hear about it. Fill out the form below 
            or reach out directly through any of the channels listed.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-5">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8">
              <div className="mb-8">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                  <MessageSquare className="h-5 w-5 text-accent" />
                  Send a Message
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Fill out the form and {"I'll"} get back to you as soon as possible.
                </p>
              </div>
              <ContactForm />
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2">
            {/* Contact Details */}
            <div className="mb-8 rounded-2xl border border-border/50 bg-card p-6">
              <h2 className="mb-6 text-lg font-semibold text-foreground">Contact Info</h2>
              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-start gap-4">
                    <div className="rounded-lg bg-accent/10 p-2 text-accent">
                      <info.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{info.label}</p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="font-medium text-foreground hover:text-accent"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="font-medium text-foreground">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="mb-8 rounded-2xl border border-border/50 bg-card p-6">
              <h2 className="mb-6 text-lg font-semibold text-foreground">Connect</h2>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-all hover:border-accent/50 hover:text-accent"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Availability Status */}
            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
                </span>
                <span className="font-semibold text-foreground">Currently Available</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {"I'm"} accepting new projects starting February 2026. Get in touch to discuss your needs.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-24">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-muted-foreground">
              Common questions about working with me.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-xl border border-border/50 bg-card p-6"
              >
                <h3 className="font-semibold text-foreground">{faq.question}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
