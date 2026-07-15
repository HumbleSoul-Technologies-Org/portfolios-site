"use client";

import React, { useEffect } from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  MessageSquare,
  Settings,
  Menu,
  X,
  ChevronLeft,
  Moon,
  Sun,
  Key,
  LogOut,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/useAuth";
import { useQuery } from "@tanstack/react-query";

const sidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/cv", label: "CV", icon: FileText },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/keys", label: "Key Management", icon: Key },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { isAuthenticated, loading, logout, user } = useAuth();
  const [newMessages, setNewMessages] = useState(0);
  const { data: Messages } = useQuery<any[]>({
    queryKey: ["contact", "messages", "all"],
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }

    if (Messages) {
      const notRead = Messages?.data?.messages?.filter(
        (m: any) => m.read === false,
      );
      setNewMessages(notRead?.length || 0);
    }
  }, [loading, isAuthenticated, router, Messages]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="rounded-2xl border border-border bg-card px-8 py-10 text-center shadow-lg shadow-black/5">
          <p className="text-lg font-medium">Checking your session…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card transition-all duration-300 lg:relative",
          collapsed ? "w-16" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Sidebar Header */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-border px-4",
            collapsed ? "justify-center" : "justify-between",
          )}
        >
          {!collapsed && (
            <>
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  <img
                    src="https://images.vexels.com/media/users/3/224169/isolated/lists/dbfe1f493ad01117fa4ec5ba10150e4d-computer-programming-logo.png"
                    alt="Logo"
                    className="h-full w-full mx-10 object-contain"
                  />
                </div>
                <span className="font-semibold">
                  Welcome, <i className="text-sm">{user?.name}</i>
                </span>
                <br />
              </Link>{" "}
              <br />
            </>
          )}
          {collapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
              <img
                src="https://images.vexels.com/media/users/3/224169/isolated/lists/dbfe1f493ad01117fa4ec5ba10150e4d-computer-programming-logo.png"
                alt="Logo"
                className="h-full w-full mx-10 object-contain"
              />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                collapsed && "rotate-180",
              )}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {sidebarLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/dashboard" && pathname.startsWith(link.href));
            const Icon = link.icon;

            return (
              <div key={link.href} className="relative">
                {user?.role === "admin" && (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      collapsed && "justify-center px-2",
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>{link.label}</span>}
                    {link.label === "Messages" &&
                      newMessages > 0 &&
                      newMessages}
                  </Link>
                )}

                {user?.role === "marketing" &&
                  link.label === "Keys Management" && (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 bg-accent/10 text-white rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        collapsed && "justify-center px-2",
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{link.label}</span>}
                    </Link>
                  )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div
          className={cn(
            "border-t border-border p-2",
            collapsed ? "flex flex-col items-center gap-2" : "space-y-2",
          )}
        >
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            onClick={logout}
            className={cn("w-full", collapsed && "w-auto")}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>

          <Link href="/" className={cn("block", collapsed && "w-full")}>
            <Button
              variant="outline"
              size={collapsed ? "icon" : "default"}
              className={cn("w-full", collapsed && "w-auto")}
            >
              <ChevronLeft className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Back to site</span>}
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile Header */}
        <header className="flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold">Dashboard</span>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
