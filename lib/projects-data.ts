export interface Project {
  _id: string
  title: string
  description: string
  longDescription: string
  image: any
  tags: string[]
  category: "web" | "mobile" | "software"
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  year: string
  client?: string
  duration?: string
  challenge?: string
  solution?: string
  results?: string[]
  testimonial?: {
    quote: string
    author: string
    role: string
  }
}

export const projects: Project[] = [
  {
    _id: "ecommerce-platform",
    title: "E-Commerce Platform",
    description: "A full-featured online store with inventory management, payment processing, and real-time analytics dashboard.",
    longDescription: "Built a comprehensive e-commerce solution for a growing retail business, featuring a modern storefront, admin dashboard, and integrated analytics. The platform handles thousands of daily transactions with 99.9% uptime.",
    image: "/projects/ecommerce.jpg",
    tags: ["Next.js", "Stripe", "PostgreSQL", "Tailwind CSS", "Vercel"],
    category: "web",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: true,
    year: "2025",
    client: "RetailCo",
    duration: "4 months",
    challenge: "The client needed a scalable platform that could handle seasonal traffic spikes while maintaining fast load times and a seamless checkout experience.",
    solution: "Implemented a headless architecture with Next.js for the frontend and a custom Node.js API. Used edge caching and optimized images to achieve sub-second load times.",
    results: [
      "45% increase in conversion rate",
      "2x faster page load times",
      "99.9% uptime during peak seasons",
      "30% reduction in cart abandonment"
    ],
    testimonial: {
      quote: "The new platform transformed our online presence. Sales have doubled and our customers love the experience.",
      author: "Sarah Johnson",
      role: "CEO, RetailCo"
    }
  },
  {
    _id: "task-management-app",
    title: "Task Management App",
    description: "Collaborative project management tool with real-time updates, team workspaces, and automated workflows.",
    longDescription: "Developed a real-time collaborative task management application that helps teams organize work, track progress, and automate repetitive workflows.",
    image: "/projects/taskapp.jpg",
    tags: ["React", "Node.js", "Socket.io", "MongoDB", "Redis"],
    category: "web",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: true,
    year: "2024",
    client: "TeamSync Inc.",
    duration: "6 months",
    challenge: "Teams were struggling with disconnected tools and manual status updates, leading to missed deadlines and communication gaps.",
    solution: "Built a unified platform with real-time synchronization, customizable workflows, and integrations with popular tools like Slack and GitHub.",
    results: [
      "50% reduction in meeting time",
      "35% improvement in project delivery times",
      "10,000+ active users in first quarter",
      "4.8/5 average user rating"
    ]
  },
  {
    _id: "healthcare-dashboard",
    title: "Healthcare Dashboard",
    description: "Patient management system with appointment scheduling, medical records, and analytics for healthcare providers.",
    longDescription: "Created a HIPAA-compliant healthcare management system that streamlines patient care, from appointment booking to medical record management.",
    image: "/projects/healthcare.jpg",
    tags: ["TypeScript", "React", "Express", "PostgreSQL", "AWS"],
    category: "software",
    liveUrl: "https://example.com",
    featured: true,
    year: "2024",
    client: "MedCare Clinic",
    duration: "8 months",
    challenge: "The clinic was using paper-based systems and disconnected software, resulting in inefficiencies and potential compliance risks.",
    solution: "Developed an integrated platform with role-based access, automated appointment reminders, and secure medical record storage.",
    results: [
      "60% reduction in administrative time",
      "Full HIPAA compliance achieved",
      "95% patient satisfaction score",
      "Zero data breaches since launch"
    ],
    testimonial: {
      quote: "This system has revolutionized how we manage our practice. Our staff can focus on patient care instead of paperwork.",
      author: "Dr. Michael Chen",
      role: "Medical Director, MedCare Clinic"
    }
  },
  {
    _id: "fitness-mobile-app",
    title: "Fitness Tracking App",
    description: "Cross-platform mobile app for workout tracking, nutrition logging, and personalized fitness plans.",
    longDescription: "Built a comprehensive fitness application that helps users track workouts, monitor nutrition, and achieve their health goals with AI-powered recommendations.",
    image: "/projects/fitness.jpg",
    tags: ["React Native", "Firebase", "TensorFlow Lite", "Node.js"],
    category: "mobile",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: false,
    year: "2024",
    client: "FitLife",
    duration: "5 months",
    challenge: "Users wanted a single app that combined workout tracking, nutrition logging, and progress visualization without being overwhelming.",
    solution: "Designed an intuitive interface with smart defaults and progressive disclosure. Integrated machine learning for exercise recognition and personalized recommendations.",
    results: [
      "100,000+ downloads in 3 months",
      "4.7 star rating on app stores",
      "40% daily active user retention",
      "Featured in App Store health category"
    ]
  },
  {
    _id: "inventory-system",
    title: "Inventory Management System",
    description: "Enterprise-grade inventory tracking with barcode scanning, automated reordering, and multi-location support.",
    longDescription: "Developed a robust inventory management solution for a manufacturing company with multiple warehouses and complex supply chain requirements.",
    image: "/projects/inventory.jpg",
    tags: ["Vue.js", "Python", "Django", "PostgreSQL", "Docker"],
    category: "software",
    featured: false,
    year: "2023",
    client: "ManufacturePro",
    duration: "7 months",
    challenge: "Manual inventory tracking was causing stockouts and overstock situations, with no visibility across multiple warehouse locations.",
    solution: "Built a centralized system with real-time stock tracking, automated low-stock alerts, and predictive reordering based on historical data.",
    results: [
      "40% reduction in stockouts",
      "25% decrease in excess inventory",
      "$500K annual savings in operational costs",
      "Real-time visibility across 5 locations"
    ]
  },
  {
    _id: "social-media-app",
    title: "Social Networking Platform",
    description: "Community-focused social platform with content creation, messaging, and event organization features.",
    longDescription: "Created a niche social networking platform for creative professionals to showcase work, connect with peers, and find collaboration opportunities.",
    image: "/projects/social.jpg",
    tags: ["Next.js", "GraphQL", "PostgreSQL", "Redis", "AWS S3"],
    category: "web",
    featured: false,
    year: "2023",
    duration: "10 months",
    challenge: "Creative professionals lacked a dedicated platform that balanced portfolio showcasing with networking and collaboration features.",
    solution: "Built a content-first platform with portfolio pages, project collaboration tools, and smart matching algorithms for finding collaborators.",
    results: [
      "25,000 registered users",
      "500+ successful collaborations facilitated",
      "3M+ monthly page views",
      "Seed funding secured based on traction"
    ]
  }
]

export const categories = [
  { value: "all", label: "All Projects" },
  { value: "web", label: "Web Development" },
  { value: "mobile", label: "Mobile Apps" },
  { value: "software", label: "Software Systems" },
]
