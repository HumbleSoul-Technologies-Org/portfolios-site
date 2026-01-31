import { Metadata } from "next"
import Link from "next/link"
import { 
  Award, 
  BookOpen, 
  Briefcase, 
  Download, 
  ExternalLink, 
  GraduationCap, 
  Languages, 
  Mail, 
  MapPin, 
  Phone 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "CV | Your Name",
  description: "View my professional resume, experience, education, and skills.",
}

const experience = [
  {
    title: "Senior Full-Stack Developer",
    company: "Tech Company",
    location: "San Francisco, CA",
    period: "2024 - Present",
    description: "Lead developer for enterprise applications, responsible for architecture decisions and mentoring junior developers.",
    achievements: [
      "Led development of a microservices architecture serving 1M+ users",
      "Reduced deployment time by 60% through CI/CD optimization",
      "Mentored 5 junior developers, improving team velocity by 40%",
    ],
  },
  {
    title: "Full-Stack Developer",
    company: "Digital Agency",
    location: "Remote",
    period: "2022 - 2024",
    description: "Developed custom web and mobile applications for clients across various industries.",
    achievements: [
      "Delivered 15+ projects on time and within budget",
      "Built e-commerce platform processing $2M+ in annual transactions",
      "Implemented automated testing, reducing bugs by 70%",
    ],
  },
  {
    title: "Junior Developer",
    company: "Startup Inc.",
    location: "New York, NY",
    period: "2020 - 2022",
    description: "Contributed to building features for a SaaS product and learned best practices from experienced developers.",
    achievements: [
      "Developed key features used by 10,000+ daily active users",
      "Contributed to open-source projects used by the company",
      "Won 'Rising Star' award for exceptional performance",
    ],
  },
]

const education = [
  {
    degree: "Bachelor of Science in Information Technology",
    school: "University of Technology",
    period: "2016 - 2020",
    description: "Specialized in Web Development and Software Engineering. Graduated with Honors.",
  },
]

const skills = {
  frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js", "HTML/CSS"],
  backend: ["Node.js", "Python", "Express", "Django", "GraphQL", "REST APIs"],
  database: ["PostgreSQL", "MongoDB", "Redis", "Prisma", "MySQL"],
  tools: ["Git", "Docker", "AWS", "Vercel", "CI/CD", "Jest"],
  soft: ["Problem Solving", "Communication", "Team Leadership", "Agile/Scrum"],
}

const certifications = [
  { name: "AWS Certified Developer", issuer: "Amazon Web Services", year: "2024" },
  { name: "Google Cloud Professional", issuer: "Google", year: "2023" },
  { name: "Meta Front-End Developer", issuer: "Meta", year: "2022" },
]

const languages = [
  { language: "English", level: "Native" },
  { language: "Spanish", level: "Professional" },
  { language: "French", level: "Basic" },
]

export default function CVPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Header */}
        <header className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Your Name
            </h1>
            <p className="mt-2 text-xl text-accent">Full-Stack Developer</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                San Francisco, CA
              </span>
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                hello@example.com
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                +1 (555) 123-4567
              </span>
            </div>
          </div>
          <Button asChild className="gap-2">
            <a href="/cv.pdf" download>
              <Download className="h-4 w-4" />
              Download PDF
            </a>
          </Button>
        </header>

        {/* Summary */}
        <section className="mb-12 rounded-xl border border-border/50 bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <BookOpen className="h-5 w-5 text-accent" />
            Professional Summary
          </h2>
          <p className="text-muted-foreground">
            Full-stack developer with 5+ years of experience building scalable web applications 
            and mobile apps. Specialized in React, Node.js, and cloud technologies. Passionate 
            about clean code, user experience, and delivering high-quality products that make 
            a real impact. Proven track record of leading projects and mentoring teams.
          </p>
        </section>

        {/* Experience */}
        <section className="mb-12">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Briefcase className="h-5 w-5 text-accent" />
            Work Experience
          </h2>
          <div className="space-y-8">
            {experience.map((job) => (
              <div key={job.title + job.company} className="rounded-xl border border-border/50 bg-card p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                    <p className="text-accent">{job.company}</p>
                    <p className="text-sm text-muted-foreground">{job.location}</p>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{job.period}</span>
                </div>
                <p className="mt-4 text-muted-foreground">{job.description}</p>
                <ul className="mt-4 space-y-2">
                  {job.achievements.map((achievement) => (
                    <li key={achievement} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="mb-12">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Award className="h-5 w-5 text-accent" />
            Technical Skills
          </h2>
          <div className="rounded-xl border border-border/50 bg-card p-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Frontend</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.frontend.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Backend</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.backend.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Database</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.database.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Tools & DevOps</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.tools.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="mb-12">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-foreground">
            <GraduationCap className="h-5 w-5 text-accent" />
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.degree} className="rounded-xl border border-border/50 bg-card p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                    <p className="text-accent">{edu.school}</p>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{edu.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{edu.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="mb-12">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Award className="h-5 w-5 text-accent" />
            Certifications
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {certifications.map((cert) => (
              <div key={cert.name} className="rounded-xl border border-border/50 bg-card p-4">
                <h3 className="font-semibold text-foreground">{cert.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{cert.issuer}</p>
                <p className="mt-1 text-xs text-muted-foreground">{cert.year}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Languages */}
        <section className="mb-12">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Languages className="h-5 w-5 text-accent" />
            Languages
          </h2>
          <div className="flex flex-wrap gap-4">
            {languages.map((lang) => (
              <div key={lang.language} className="rounded-xl border border-border/50 bg-card px-4 py-3">
                <span className="font-medium text-foreground">{lang.language}</span>
                <span className="ml-2 text-sm text-muted-foreground">({lang.level})</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4 rounded-xl border border-accent/30 bg-accent/5 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Interested in working together?</h3>
            <p className="mt-1 text-muted-foreground">{"Let's"} discuss how I can help with your project.</p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/contact">
              Contact Me
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
