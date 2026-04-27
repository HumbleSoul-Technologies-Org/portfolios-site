import { SystemProfile } from "../types/keys";

export const mockSystems: SystemProfile[] = [
  {
    id: "sys-001",
    name: "Inventory Management System",
    description: "Multi-business inventory tracking and management with real-time sync",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop",
    link: "https://inventory.example.com",
    latestVersion: "2.1.0",
    numberOfBusinesses: 5,
    createdAt: new Date("2024-01-15"),
    lastUpdatedAt: new Date("2024-04-10"),
    
  },
  {
    id: "sys-002",
    name: "E-Commerce Platform",
    description: "Complete e-commerce solution with payment processing and order management",
    image: "https://images.unsplash.com/photo-1460925895917-adf4e5a4d5ac?w=200&h=200&fit=crop",
    link: "https://ecommerce.example.com",
    latestVersion: "3.0.5",
    numberOfBusinesses: 8,
    createdAt: new Date("2023-06-01"),
    lastUpdatedAt: new Date("2024-03-22"),
  },
  {
    id: "sys-003",
    name: "Customer Relationship Management",
    description: "CRM system for managing customer interactions and sales pipeline",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop",
    link: "https://crm.example.com",
    latestVersion: "1.8.2",
    numberOfBusinesses: 3,
    createdAt: new Date("2023-09-20"),
    lastUpdatedAt: new Date("2024-02-14"),
  },
];
