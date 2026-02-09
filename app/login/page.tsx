"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/useAuth";

function LoginForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, user, loading } = useAuth();

  const loginSchema = z.object({
    username: z.string().min(1, "Enter your username"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })

  type LoginFormValues = z.infer<typeof loginSchema>

  const { register, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  })

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (user && !loading) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  async function onSubmit(values: LoginFormValues) {
    setSubmitting(true);
    setError(null);
    try {
      await login(values.username, values.password);
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6 rounded-lg border border-border bg-card p-6"
      >
        <h1 className="text-lg font-semibold">Login</h1>
        {error && <div className="text-sm text-destructive">{error}</div>}

        <div>
          <Label htmlFor="username">Username</Label>
          <Input className="mt-4" id="username" {...register("username")} />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input className="mt-4" id="password" type="password" {...register("password")} />
        </div>

        <div className="flex items-center justify-between">
          <Button type="submit" disabled={submitting || !formState.isValid} className="w-full">
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
