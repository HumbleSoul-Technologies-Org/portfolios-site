"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useKeysData } from "@/lib/hooks/useKeysData";
import { Plus, Package, Key } from "lucide-react";

export default function KeysPage() {
  const router = useRouter();
  const { systems, isLoading } = useKeysData();

  const handleCreateSystem = () => {
    router.push("/dashboard/keys/create-system");
  };

  const handleViewSystem = (systemId: string) => {
    router.push(`/dashboard/keys/${systemId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading systems...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Keys Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your system profiles and generate primary keys for
            distribution
          </p>
        </div>
        {systems.length > 0 && (
          <Button onClick={handleCreateSystem} className="gap-2">
            <Plus className="h-4 w-4" />
            Create System
          </Button>
        )}
      </div>

      {/* Systems Grid */}
      {systems.length === 0 ? (
        <Card className="border-dashed h-screen flex items-center justify-center">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No systems yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first system profile to start generating keys
            </p>
            <Button onClick={handleCreateSystem} variant="outline">
              Create System
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systems.map((system) => (
            <Card
              key={system.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleViewSystem(system.id || "")}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-2">
                      {system.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {system.description.trim()}
                    </CardDescription>
                  </div>
                  {system.image && (
                    <img
                      src={system.image}
                      alt={system.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Version</p>
                    <p className="font-semibold">{system.latestVersion}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1">
                      Keys <Key />
                    </p>
                    <p className="font-semibold">
                      {system.productKeys?.keys.length || 0}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Last Updated
                  </p>
                  <p className="text-sm">
                    {new Date(
                      system?.updatedAt || system?.createdAt || Date.now(),
                    ).toLocaleDateString()}
                  </p>
                </div>
                {system.link && (
                  <a
                    href={system.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline block truncate"
                  >
                    {system.link}
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
