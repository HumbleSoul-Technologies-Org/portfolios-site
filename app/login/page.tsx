"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
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
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6 rounded-lg border border-border bg-card p-6 sm:p-8 animate-fade-in"
      >
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3">
            <p className="text-sm text-destructive font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input 
            className="mt-2" 
            id="username" 
            disabled={submitting}
            placeholder="Enter your username"
            {...register("username")} 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            className="mt-2" 
            id="password" 
            type="password" 
            disabled={submitting}
            placeholder="Enter your password"
            {...register("password")} 
          />
        </div>

        <Button 
          type="submit" 
          disabled={submitting || !formState.isValid} 
          className="w-full gap-2 transition-all"
        >
          {submitting ? (
            <>
              <Spinner className="h-4 w-4" />
              <span>Signing in...</span>
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        {submitting && (
          <div className="rounded-lg border border-border/50 bg-muted/30 px-4 py-3">
            <p className="text-xs text-muted-foreground text-center">
              ⏳ Authenticating your credentials. Please wait...
            </p>
          </div>
        )}
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
