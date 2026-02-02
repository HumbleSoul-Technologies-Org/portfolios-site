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
  title: "CV | Kisibo Jonathan",
  description: "View my professional resume, experience, education, and skills.",
}

const experience = [
  {
    title: " Full-Stack Developer",
    company: "Hanli Company Uganda LTD",
    location: "Kampala, Uganda",
    period: "2025 - Present",
    description: "Developing and maintaining web applications to enhance the company's online presence and customer engagement.",
    achievements: [
      "Creted a responsive website that increased user engagement by 30%",
      "managed the website content and ensured regular updates",
      "Linked the website to social media platforms to boost marketing efforts",
    ],
  },
  {
    title: "Full-Stack Developer",
    company: "Business Acceleration Group (BAG)",
    location: "Kampala, Uganda",
    period: "2026",
    description: "Built custom responsive website for the company to enhance their online presence and customer engagement.",
    achievements: [
      "Developed a user-friendly website that improved customer interaction",
      "Integrated e-commerce features to facilitate online transactions",
      "Optimized website performance for faster load times",
    ],
  },
  {
    title: "Full-Stack Developer",
    company: "AIO Solars LTD",
    location: "Kampala, Uganda",
    period: "2026",
    description: "Built custom responsive website for the company to enhance their online presence and customer engagement.",
    achievements: [
      "Designed and implemented a modern website layout",
      "Ensured mobile responsiveness for better accessibility",
      "Collaborated with the marketing team to align website content with brand messaging",
    ],
  },
]

const education = [
  {
    degree: "Bachelors degree in Information Technology",
    school: "Kampala International University",
    period: "2021 - 2024",
    description: "Specialized in IT- support, Web Development and Networking. Graduated with Honors.",
  },
  {
    High: "Uganda Advanced Certificate of Education (UACE)",
    school: "Mukono King's High School",
    period: "2018 - 2019",
     
  },
  {
    High: "Uganda  Certificate of Education (UCE)",
    school: "Namiryango- Mixed Secondary School",
    period: "2016 - 2017",
     
  },
]

const skills = {
  frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "W3-CSS", "HTML/CSS"],
  backend: ["Node.js","Express", "REST APIs"],
  database: ["PostgreSQL", "MongoDB", "MySQL"],
  tools: ["Git" , "Vercel", "Render", ],
  soft: ["Problem Solving", "Communication", "Time management", "Teamwork"],
}

const certifications = [
  { name: "Programming in Python", issuer: "Makerere University", year: "2024" },
  { name: "Cybersecurity Fundamentals", issuer: "CISCO", year: "2024" },
  { name: "Networking Fundamentals", issuer: "CISCO", year: "2024" },
]

const languages = [
  { language: "English", level: "Native" },
  { language: "Luganda", level: "Professional" },
  { language: "Lugisu", level: "Basic" },
  { language: "Lusoga", level: "Basic" },
]

export default function CVPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Header */}
        <header className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Kisibo Jonathan
            </h1>
            <p className="mt-2 text-xl text-accent">Full-Stack Developer</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Kampala, Uganda
              </span>
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                kisibojonathan150@gmail.com
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                +256 741 745 165
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
            Full-stack developer with 3+ years of experience building scalable web applications 
            and mobile apps. Specialized in React, Node.js, and cloud technologies. Passionate 
            about clean code, user experience, and delivering high-quality products that make 
            a real impact. Proven track record of leading projects and mentoring juniors.
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
                      <span className="mt-1.5 h-1.5 w-1.5  shrink-0 rounded-full bg-accent" />
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
                <h3 className="mb-3 text-sm font-semibold text-accent">Frontend</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.frontend.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-accent">Backend</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.backend.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-accent">Database</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.database.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-accent">Tools & DevOps</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.tools.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-accent">Soft Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.soft.map((skill) => (
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
