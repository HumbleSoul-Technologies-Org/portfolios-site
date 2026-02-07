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
      
      console.log("Refresh: savedProfile =", savedProfile);
      console.log("Refresh: savedToken =", savedToken);
      
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
          console.log("Refresh: User restored from localStorage:", parsedProfile);
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
      console.warn("Corrupted profile in localStorage, clearing");
      localStorage.removeItem("profile");
    }
    if (token === "undefined") {
      console.warn("Corrupted token in localStorage, clearing");
      localStorage.removeItem("token");
    }
    
    refresh();
  }, []);

  async function login(username: string, password: string) {
    try {
      console.log("Attempting login with email:", username);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/login`, 
        { email: username, password }
      );
      console.log("Full login response:", response.data);
      
      if (response.status === 200) {
        // Extract user and token - handle multiple possible response structures
        const responseData = response.data.data || response.data;
        const admin = responseData?.admin || responseData;
        const token = responseData?.token;
        
        if (!admin || !token) {
          throw new Error(`Invalid response structure. Admin: ${!!admin}, Token: ${!!token}`);
        }
        
        console.log("Extracted admin:", admin);
        console.log("Extracted token:", token);
        
        // Store in localStorage first
        localStorage.setItem("profile", JSON.stringify(admin));
        localStorage.setItem("token", token);
        console.log("Stored in localStorage");
        
        // Set session cookie with proper formatting
        const cookieValue = `${token}`;
        document.cookie = `session=${encodeURIComponent(cookieValue)}; path=/; max-age=86400`;
        console.log("Cookie set");
        
        // Update state
        setUser(admin);
        setToken(token);
        console.log("State updated, navigating to dashboard");
        
        // Give browser a moment to set cookie, then navigate
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 100);
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
      console.log("Starting logout...");
      
      // Clear state first
      setUser(null);
      setToken(null);
      console.log("State cleared");
      
      // Clear localStorage
      localStorage.removeItem("profile");
      localStorage.removeItem("token");
      console.log("localStorage cleared");
      console.log("profile after remove:", localStorage.getItem("profile"));
      console.log("token after remove:", localStorage.getItem("token"));
      
      // Clear session cookie
      document.cookie = "session=; path=/; max-age=0";
      console.log("Session cookie cleared");
      
      // Call logout API
      try {
        await fetch("/api/auth/logout", { method: "POST" });
        console.log("API logout called");
      } catch (apiErr) {
        console.error("API logout failed (but continuing):", apiErr);
      }
      
      // Give browser time to clear everything, then redirect
      setTimeout(() => {
        console.log("Redirecting to login");
        window.location.href = "/login";
      }, 200);
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
