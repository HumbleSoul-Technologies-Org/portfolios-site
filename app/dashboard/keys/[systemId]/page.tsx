"use client";

import React, { use, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useKeysData } from "@/lib/hooks/useKeysData";
import { KeyCreationForm } from "@/components/keys/KeyCreationForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Copy, Eye, Loader, CopyCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  FilterOptions,
  ProductKey,
  MarkKeyAsUsedInput,
} from "@/lib/types/keys";
import { KeyDetailsModal } from "@/components/keys/KeyDetailsModal";
import { DeleteSystemDialog } from "@/components/keys/DeleteSystemDialog";
import { useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import { apiRequest } from "@/lib/queryClient";

export default function SystemKeysPage() {
  const params = useParams();
  const router = useRouter();
  const systemId = params.systemId as string;

  const {
    getSystemById,
    getSystemKeys,
    // filterKeys,
    copyToClipboard,
    generateKeys,
    markKeyAsUsed,
    deleteSystem,
    getSystemStats,
    systems,
    isLoading,
  } = useKeysData();

  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
    searchText: "",
  });
  const [selectedProductKey, setSelectedProductKey] =
    useState<ProductKey | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copying, setCopying] = useState<any | null>(null);
  const { user } = useAuth();
  const system = getSystemById(systemId) || null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading system...</p>
      </div>
    );
  }

  if (!system) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="space-y-3 rounded-lg border bg-background p-8 text-center shadow-sm">
          <p className="text-xl font-semibold">System not found</p>
          <p className="text-sm text-muted-foreground">
            The requested system profile could not be located.
          </p>
          <Button onClick={() => router.push("/dashboard/keys")}>
            Return to systems
          </Button>
        </div>
      </div>
    );
  }

  const totalKeys = system?.productKeys?.keys?.length || 0;

  const usedKeys =
    system?.productKeys?.keys?.filter((k: any) => k.status === "used").length ||
    0;
  const unusedKeys = totalKeys - usedKeys || 0;

  const usedPercentage =
    totalKeys > 0 ? Math.round((usedKeys / totalKeys) * 100) : 0;

  const filteredKeys = () => {
    let keys = system?.productKeys?.keys || [];
    for (const [key, value] of Object.entries(filters)) {
      if (value && value !== "all") {
        if (key === "searchText") {
          keys = (keys as any).filter(
            (k: any) =>
              k.key.toLowerCase().includes(value.toLowerCase()) ||
              (k.purchasedBy &&
                k.purchasedBy.toLowerCase().includes(value.toLowerCase())),
          );
        } else if (key === "status") {
          keys = (keys as any).filter((k: any) => k.status === value);
        } else if (key === "dateFrom") {
          keys = (keys as any).filter(
            (k: any) => new Date(k.createdAt) >= new Date(value as string),
          );
        } else if (key === "dateTo") {
          keys = (keys as any).filter(
            (k: any) => new Date(k.createdAt) <= new Date(value as string),
          );
        }
      }
    }
    // Sort to show unused keys first
    keys = (keys as any).sort((a: any, b: any) => {
      if (a.status === "unused" && b.status === "used") return -1;
      if (a.status === "used" && b.status === "unused") return 1;
      return 0;
    });
    return keys;
  };

  const handleCopyKey = async (id: string) => {
    try {
      await apiRequest("POST", `/auth/${user?.id}/copy-key`, { key: id });
    } catch (error) {
      console.error("Copy error:", error);
      toast({
        title: "Error",
        description: "Failed to copy the key. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      {user?.role === "admin" && (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
                {system.name}
              </h1>
              <p className="text-muted-foreground mt-1">{system.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/keys/${systemId}/edit`)}
            >
              Edit Profile
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete Profile
            </Button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {system?.productKeys?.keys?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Generated for this system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Used Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usedKeys}</div>
            <p className="text-xs text-muted-foreground">
              {usedPercentage}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unused Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unusedKeys}</div>
            <p className="text-xs text-muted-foreground">
              Available for distribution
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Ugx{" "}
              {system?.productKeys?.keys
                ?.filter((k: any) => k.status === "used")
                .reduce((sum: number, key: any) => sum + (key.price || 0), 0)
                .toLocaleString() || "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              From sold/activated keys
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Key Creation Form */}
      {user?.role === "admin" && (
        <KeyCreationForm
          systemId={systemId}
          isLoading={isLoading}
          generateKeys={generateKeys}
        />
      )}

      {/* Filters and Actions */}
      <Card className="border max-h-screen overflow-hidden">
        <CardHeader>
          <CardTitle>Keys</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Keys</Label>
              <Input
                id="search"
                placeholder="Search by key ID or contact..."
                value={filters.searchText || ""}
                onChange={(e) =>
                  setFilters({ ...filters, searchText: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status || "all"}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    status: (value as "used" | "unused" | "all") || "all",
                  })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unused">Unused</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={
                  filters.dateFrom
                    ? filters.dateFrom.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    dateFrom: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={
                  filters.dateTo
                    ? filters.dateTo.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    dateTo: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
          </div>

          {/* Keys Table */}
          {filteredKeys().length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">No keys found</p>
            </div>
          ) : (
            <div className="border max-h-screen h-screen overflow-y-auto rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Key ID</TableHead>
                    <TableHead className="w-1/6">Status</TableHead>
                    <TableHead className="w-1/6">Price</TableHead>
                    <TableHead className="w-1/4">Purchased By</TableHead>
                    <TableHead className="w-1/6">Activate Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="">
                  {filteredKeys()?.map((key: any, index: number) => (
                    <TableRow
                      key={key.key || index}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-mono text-xs break-all">
                        {key.key || index}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            key.status === "used" ? "default" : "secondary"
                          }
                        >
                          {key.status === "used" ? "Used" : "Unused"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        Ugx {key.price?.toLocaleString() || "0.00"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {key.status === "used" ? (
                          <div>
                            <p className="font-medium">
                              <a
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-accent hover:text-accent/80"
                                href={`mailto:${key.purchasedBy}`}
                              >
                                {key.purchasedBy || "N/A"}
                              </a>
                            </p>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">-</p>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {key.activatedAt
                          ? new Date(key.activatedAt).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {key.status === "unused" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={async () => {
                                setCopying(key.key);
                                try {
                                  await handleCopyKey(key.key);
                                  copyToClipboard(key.key);
                                } finally {
                                  setCopying(null);
                                }
                              }}
                              title="Copy key"
                            >
                              {copying === key.key ? (
                                <Loader className="loading loading-spinner animate-spin" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedProductKey(key);
                              setIsModalOpen(true);
                            }}
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key Details Modal */}
      {selectedProductKey && (
        <KeyDetailsModal
          key={`modal-${selectedProductKey.key}`}
          productKey={selectedProductKey}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProductKey(null);
          }}
          onMarkAsUsed={(input: MarkKeyAsUsedInput) => {
            markKeyAsUsed(input);
          }}
          onCopyKey={async (keyId: string) => {
            setCopying(keyId);
            try {
              await handleCopyKey(keyId);
              const success = await copyToClipboard(keyId);
              if (!success) {
                throw new Error("Failed to copy");
              }
            } finally {
              setCopying(null);
            }
          }}
          isCopying={!!copying}
        />
      )}

      <DeleteSystemDialog
        open={isDeleteOpen}
        isDeleting={isDeleting}
        onOpenChange={(open) => {
          setIsDeleteOpen(open);
          if (!open) {
            setIsDeleting(false);
          }
        }}
        onConfirm={async (password: string) => {
          setIsDeleting(true);
          try {
            const success = await deleteSystem(systemId, password);
            if (success) {
              router.push("/dashboard/keys");
            }
          } catch (error) {
            console.error("Deletion error:", error);
          } finally {
            setIsDeleting(false);
            setIsDeleteOpen(false);
          }
        }}
      />
    </div>
  );
}
