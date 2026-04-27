"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// TODO: TEMP: Re-add axios import when restoring real authentication
// import axios from "axios";
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  title?: string;
  avatarUrl?: { url: string; puplic_id: string };
  phone?: string;
  address?: string;
  website?: string;
  bio?: string;
}

// TODO: TEMP: Remove hardcoded user and token - restore real authentication
const HARDCODED_TOKEN = "dev-temp-session-token-12345";
const HARDCODED_USER: User = {
  id: "dev-temp-user-id",
  name: "Dev User",
  email: "dev@example.com",
  token: HARDCODED_TOKEN,
  title: "Developer",
  bio: "Temporary hardcoded user for development",
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  token?: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function refresh() {
    setLoading(true);
    try {
      // TODO: TEMP: Replace with real refresh() logic from localStorage
      // This temporarily uses hardcoded credentials for development
      setToken(HARDCODED_TOKEN);
      // Sync cookie
      document.cookie = `session=${encodeURIComponent(HARDCODED_TOKEN)}; path=/; max-age=86400`;
      setUser(HARDCODED_USER);
    } catch (err) {
      console.error("Refresh error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Clean up any corrupted localStorage entries
    const profile = localStorage.getItem("profile");
    const token = localStorage.getItem("token");

    if (profile === "undefined") {
      localStorage.removeItem("profile");
    }
    if (token === "undefined") {
      localStorage.removeItem("token");
    }

    refresh();
  }, []);

  async function login(username: string, password: string) {
    try {
      // TODO: TEMP: Remove hardcoded login bypass - restore real API call
      // For now, we're bypassing the external API and using hardcoded credentials
      const admin = HARDCODED_USER;
      const token = HARDCODED_TOKEN;

      // Store in localStorage first
      localStorage.setItem("profile", JSON.stringify(admin));
      localStorage.setItem("token", token);

      // Set session cookie with proper formatting
      const cookieValue = `${token}`;
      document.cookie = `session=${encodeURIComponent(cookieValue)}; path=/; max-age=86400`;

      // Update state
      setUser(admin);
      setToken(token);
      // Navigate to dashboard using Next router
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMsg =
        error.response?.data?.message || error.message || "Login failed";
      toast({
        title: "Login failed",
        description: errorMsg,
        variant: "destructive",
      });
    }
  }

  async function logout() {
    try {
      // Clear state and storage
      setUser(null);
      setToken(null);
      localStorage.removeItem("profile");
      localStorage.removeItem("token");
      document.cookie = "session=; path=/; max-age=0";

      // Call logout API (best-effort)
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch (apiErr) {
        console.error("API logout failed (but continuing):", apiErr);
      }

      // Redirect to login
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      // Force redirect even if something fails
      window.location.href = "/login";
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, refresh, token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
