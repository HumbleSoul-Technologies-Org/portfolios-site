"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/useAuth";

function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, user, loading } = useAuth();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (!loading ) {
      console.log("User authenticated on login page, redirecting to dashboard");
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login(username, password);
      // Redirect is handled in useAuth hook
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-6 rounded-lg border border-border bg-card p-6"
      >
        <h1 className="text-lg font-semibold">Login</h1>
        {error && <div className="text-sm text-destructive">{error}</div>}

        <div>
          <Label htmlFor="username">Username</Label>
          <Input
          className="mt-4"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder=""
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
          className="mt-4"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=""
          />
        </div>

        <div className="flex items-center justify-between">
          <Button type="submit" disabled={submitting || !username || !password} className="w-full">
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
