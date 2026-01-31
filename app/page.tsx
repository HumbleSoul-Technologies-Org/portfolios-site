import { HeroSection } from "@/components/home/hero-section"
import { SkillsSection } from "@/components/home/skills-section"
import { FeaturedProjects } from "@/components/home/featured-projects"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SkillsSection />
      <FeaturedProjects />
      <CTASection />
    </>
  )
}
