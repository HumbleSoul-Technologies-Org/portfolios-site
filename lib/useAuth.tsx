"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "./queryClient";

type User = {
  username: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const STORAGE_USER_KEY = "auth_user";
const STORAGE_TOKEN_KEY = "auth_token";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loadStoredSession() {
  if (typeof window === "undefined") {
    return { user: null, token: null };
  }

  const token = localStorage.getItem(STORAGE_TOKEN_KEY);
  const userJson = localStorage.getItem(STORAGE_USER_KEY);

  if (!token || !userJson) {
    return { user: null, token: null };
  }

  try {
    return { user: JSON.parse(userJson) as User, token };
  } catch {
    return { user: null, token: null };
  }
}

function persistSession(user: User, token: string) {
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
  localStorage.setItem(STORAGE_TOKEN_KEY, token);
}

function clearSessionStorage() {
  localStorage.removeItem(STORAGE_USER_KEY);
  localStorage.removeItem(STORAGE_TOKEN_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = useMemo(() => !!user && !!token, [user, token]);

  const refresh = async () => {
    if (typeof window === "undefined") {
      return;
    }

    setLoading(true);

    const stored = loadStoredSession();
    if (!stored.token || !stored.user) {
      clearSessionStorage();
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    setUser(stored.user);
    setToken(stored.token);

    try {
      // Make direct fetch call to check auth status without throwing on 401
      const BASE_URL = (process.env.NEXT_PUBLIC_API_URL as string) || "/api";
      const res = await fetch(`${BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${stored.token}`,
        },
      });

      if (res.status === 401) {
        // Token is invalid, clear session
        setUser(null);
        setToken(null);
        clearSessionStorage();
        setLoading(false);
        return;
      }

      if (!res.ok) {
        // Server error, but keep session for now
        console.warn("Auth check failed, keeping stored session");
        setLoading(false);
        return;
      }

      const data = await res.json();
      const verifiedUser = data?.user ?? data?.data?.user ?? data?.data?.admin;

      if (!verifiedUser) {
        // Invalid response, clear session
        setUser(null);
        setToken(null);
        clearSessionStorage();
      } else {
        // Valid session, update user data
        setUser(verifiedUser);
        persistSession(verifiedUser, stored.token);
      }
    } catch (error) {
      // Network error, keep stored session
      console.warn("Auth check network error, keeping stored session", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const res = await apiRequest("POST", "/auth/login", {
        username,
        password,
      });
      const data = await res.json();
      const tokenData = data?.token ?? data?.data?.token;
      const userData = data?.user ?? data?.data?.admin;

      if (!tokenData || !userData) {
        throw new Error(data?.error || "Authentication failed");
      }

      setUser(userData);
      setToken(tokenData);
      persistSession(userData, tokenData);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const currentToken = token || loadStoredSession().token;
    setUser(null);
    setToken(null);
    clearSessionStorage();

    try {
      await apiRequest(
        "POST",
        "/auth/logout",
        undefined,
        currentToken ?? undefined,
      );
    } catch (error) {
      console.error("Logout error:", error);
    }

    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isAuthenticated, login, logout, refresh }}
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
