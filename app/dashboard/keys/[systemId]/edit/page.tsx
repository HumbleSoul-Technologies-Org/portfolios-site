"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
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
import { SystemProfile } from "@/lib/types/keys";

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
});

type SystemFormValues = z.infer<typeof systemSchema>;

export default function EditSystemPage() {
  const params = useParams();
  const router = useRouter();
  const systemId = params.systemId as string;
  const { getSystemById, updateSystem, isLoading } = useKeysData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const system = getSystemById(systemId) as SystemProfile | undefined;

  const { register, handleSubmit, formState, reset } =
    useForm<SystemFormValues>({
      resolver: zodResolver(systemSchema),
      mode: "onChange",
      defaultValues: {
        latestVersion: "1.0.0",
      },
    });

  useEffect(() => {
    if (system) {
      reset({
        name: system.name,
        description: system.description,
        image: system.image,
        link: system.link,
        latestVersion: system.latestVersion || "1.0.0",
      });
    }
  }, [system, reset]);

  async function onSubmit(values: SystemFormValues) {
    if (!systemId) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateSystem(systemId, {
        name: values.name,
        description: values.description,
        image: values.image,
        link: values.link,
        latestVersion: values.latestVersion,
      });

      toast({
        title: "System updated",
        description: "Your system profile was updated successfully.",
        variant: "default",
      });

      router.push(`/dashboard/keys/${systemId}`);
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Unable to update the system profile.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading || !system) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <p className="text-muted-foreground">Loading system details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/dashboard/keys/${systemId}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit System Profile
          </h1>
          <p className="text-muted-foreground mt-1">
            Adjust the profile details for {system.name}
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Edit System</CardTitle>
          <CardDescription>
            Update the system profile details and save your changes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            </div>

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
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !formState.isValid}
              >
                {isSubmitting ? (
                  <>
                    Saving... <Loader className="animate-spin" />
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/dashboard/keys/${systemId}`)}
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
