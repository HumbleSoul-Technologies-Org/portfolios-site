"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Download } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const heroImages = [
  "/hero/dev-1.jpg",
  "/hero/dev-2.jpg",
  "/hero/dev-3.jpg",
  "/hero/dev-4.jpg",
  "/hero/dev-5.jpg",
]

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden">
      {/* Background Images Carousel */}
      <div className="absolute inset-0 -z-20">
        {heroImages.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={src || "/placeholder.svg"}
              alt=""
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 -z-10 bg-background/85 dark:bg-background/90" />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,transparent_49%,var(--border)_50%,transparent_51%,transparent_100%)] bg-size-[4rem_4rem] opacity-20" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,transparent_49%,var(--border)_50%,transparent_51%,transparent_100%)] bg-size-[4rem_4rem] opacity-20" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
        <div className="flex flex-col items-center text-center">
          {/* Status Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Available for new projects
          </div>

          {/* Main Heading */}
          <h1 className="animate-fade-in text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-white to-orange-500 max-w-4xl text-balance text-4xl font-bold tracking-tight   sm:text-5xl lg:text-6xl [animation-delay:100ms]">
            Building digital products that
             
            <span className="relative ml-2 inline-block">
              <span className="relative z-10">make an impact</span>
              <span className="absolute bottom-2 left-0 z-0 h-3 w-full bg-accent/20" />
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl animate-fade-in [animation-delay:200ms]">
            Full-stack developer specializing in Web Development, Mobile Apps, and 
            Software Systems. Turning complex ideas into elegant, scalable solutions.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-4 animate-fade-in [animation-delay:300ms]">
            <Button asChild size="lg" className="gap-2 transition-all hover:scale-105 active:scale-95">
              <Link href="/projects">
                View My Work
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 bg-transparent transition-all hover:scale-105 active:scale-95">
              <Link href="/cv">
                <Download className="h-4 w-4" />
                Download CV
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 border-t border-border/40 pt-8 sm:gap-12">
            {[
              { value: "3", label: "Years Experience" },
              { value: "10+", label: "Projects Completed" },
              { value: "4", label: "Happy Clients" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-foreground sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
