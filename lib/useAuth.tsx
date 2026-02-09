"use client"

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

interface User {
  id: string,
  name: string,
  email: string,
  token: string,
  title?: string,
  avatarUrl?: { url: string, puplic_id: string },
  phone?: string,
  address?: string,
  website?: string,
  bio?: string,
}
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
  const [user, setUser] = useState<User|null>(null);
  const [token, setToken] = useState<string | any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function refresh() {
    setLoading(true);
    try {
      const savedProfile = localStorage.getItem("profile");
      const savedToken = localStorage.getItem("token");
      
      // restored saved profile/token from localStorage (silently)
      
      // Guard against "undefined" string values
      if (savedToken && savedToken !== "undefined") {
        setToken(savedToken);
        // Sync cookie
        document.cookie = `session=${encodeURIComponent(savedToken)}; path=/; max-age=86400`;
      }

      if (savedProfile && savedProfile !== "undefined") {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          setUser(parsedProfile);
        } catch (parseErr) {
          console.error("Failed to parse profile:", parseErr);
          setUser(null);
          localStorage.removeItem("profile");
        }
      } else {
        setUser(null);
      }
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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/login`, 
        { email: username, password }
      );
      // login response received
      
      if (response.status === 200) {
        // Extract user and token - handle multiple possible response structures
        const responseData = response.data.data || response.data;
        const admin = responseData?.admin || responseData;
        const token = responseData?.token;
        
        if (!admin || !token) {
          throw new Error(`Invalid response structure. Admin: ${!!admin}, Token: ${!!token}`);
        }
        
        // extracted admin and token
        
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
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Login failed";
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
    <AuthContext.Provider value={{ user, loading, login, logout, refresh,token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
