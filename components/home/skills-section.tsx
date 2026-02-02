import { Code2, Database, Globe, Laptop, Palette, Server, Smartphone, Wrench,Megaphone } from "lucide-react"

const skills = [
  {
    icon: Globe,
    title: "Web Development",
    description: "Building responsive, performant web applications with modern frameworks and best practices.",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description: "Creating native and cross-platform mobile experiences that users love.",
    technologies: ["React Native", "iOS", "Android"],
  },
  {
    icon: Server,
    title: "Backend Development",
    description: "Designing scalable server architectures and robust APIs.",
    technologies: ["Node.js", "Express"],
  },
  {
    icon: Database,
    title: "Database Design",
    description: "Structuring data for optimal performance and maintainability.",
    technologies: ["PostgreSQL", "MongoDB", "SQL"],
  },
  // {
  //   icon: Palette,
  //   title: "UI/UX Design",
  //   description: "Crafting intuitive interfaces with attention to user experience.",
  //   technologies: ["Figma", "Design Systems", "Prototyping", "User Research"],
  // },
  {
    icon: Megaphone,
    title: "Social Media Marketing",
    description: "Making your brand stand out with targeted social media strategies.",
    technologies: ["Facebook Ads", "Instagram Marketing", "LinkedIn", "Twitter"],
  },
]

export function SkillsSection() {
  return (
    <section className="bg-secondary/30 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-accent">
            Expertise
          </p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Skills & Technologies
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            A comprehensive toolkit for building modern digital products from concept to deployment.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <div
              key={skill.title}
              className="group rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-accent/30 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex rounded-lg bg-accent/10 p-3 text-accent">
                <skill.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {skill.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {skill.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {skill.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
