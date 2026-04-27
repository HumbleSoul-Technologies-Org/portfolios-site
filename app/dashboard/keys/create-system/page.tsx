"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useKeysData } from "@/lib/hooks/useKeysData";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Loader } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const systemSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must not exceed 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  image: z.string().url("Image must be a valid URL"),
  link: z.string().url("Link must be a valid URL"),
  latestVersion: z
    .string()
    .optional()
    .default("1.0.0")
    .refine(
      (val) => /^\d+\.\d+\.\d+$/.test(val),
      "Version must be in format X.Y.Z",
    ),
});

type SystemFormValues = z.infer<typeof systemSchema>;

export default function CreateSystemPage() {
  const router = useRouter();
  const { createSystem } = useKeysData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState, reset } =
    useForm<SystemFormValues>({
      resolver: zodResolver(systemSchema),
      mode: "onChange",
      defaultValues: {
        latestVersion: "1.0.0",
      },
    });

  async function onSubmit(values: SystemFormValues) {
    setIsSubmitting(true);
    try {
      createSystem({
        name: values.name,
        description: values.description,
        image: values.image,
        link: values.link,
        latestVersion: values.latestVersion,
      });

      toast({
        title: "Success!",
        description: "System profile created successfully",
        variant: "default",
      });

      reset();
      router.push("/dashboard/keys");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create system profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard/keys")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create System Profile
          </h1>
          <p className="text-muted-foreground mt-1">
            Set up a new system to start generating primary keys
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>System Details</CardTitle>
          <CardDescription>
            Provide information about your system and services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* System Name */}
            <div className="space-y-2">
              <Label htmlFor="name">System Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Inventory Management System"
                disabled={isSubmitting}
                {...register("name")}
              />
              {formState.errors.name && (
                <p className="text-xs text-destructive">
                  {formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what your system does and its features"
                disabled={isSubmitting}
                rows={4}
                {...register("description")}
              />
              {formState.errors.description && (
                <p className="text-xs text-destructive">
                  {formState.errors.description.message}
                </p>
              )}
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image">Logo/Image URL *</Label>
              <Input
                id="image"
                placeholder="https://example.com/logo.jpg"
                disabled={isSubmitting}
                {...register("image")}
              />
              {formState.errors.image && (
                <p className="text-xs text-destructive">
                  {formState.errors.image.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Use a direct image URL (PNG, JPG recommended)
              </p>
            </div>

            {/* System Link */}
            <div className="space-y-2">
              <Label htmlFor="link">System Link *</Label>
              <Input
                id="link"
                placeholder="https://your-system.example.com"
                disabled={isSubmitting}
                {...register("link")}
              />
              {formState.errors.link && (
                <p className="text-xs text-destructive">
                  {formState.errors.link.message}
                </p>
              )}
            </div>

            {/* Latest Version */}
            <div className="space-y-2">
              <Label htmlFor="latestVersion">Latest Version</Label>
              <Input
                id="latestVersion"
                placeholder="1.0.0"
                disabled={isSubmitting}
                {...register("latestVersion")}
              />
              {formState.errors.latestVersion && (
                <p className="text-xs text-destructive">
                  {formState.errors.latestVersion.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Format: X.Y.Z (e.g., 1.0.0)
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !formState.isValid}
              >
                {isSubmitting ? (
                  <>
                    Creating... <Loader className="animate-spin" />
                  </>
                ) : (
                  "Create System"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/keys")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
