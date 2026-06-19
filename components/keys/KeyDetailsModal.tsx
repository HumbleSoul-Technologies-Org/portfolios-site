"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ProductKey, MarkKeyAsUsedInput } from "@/lib/types/keys";
import { toast } from "@/hooks/use-toast";
import { Copy, Loader } from "lucide-react";

const usedKeySchema = z.object({
  purchasedBy: z.string().min(2, "Contact name must be at least 2 characters"),
  purchasedOn: z.string().refine((date) => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  }, "Invalid date"),
});

type UsedKeyFormValues = z.infer<typeof usedKeySchema>;

interface KeyDetailsModalProps {
  productKey: ProductKey | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsUsed: (input: MarkKeyAsUsedInput) => void;
  onCopyKey?: (keyId: string) => Promise<void>;
  isCopying?: boolean;
}

export function KeyDetailsModal({
  productKey,
  isOpen,
  onClose,
  onMarkAsUsed,
  onCopyKey,
  isCopying = false,
}: KeyDetailsModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState, reset } =
    useForm<UsedKeyFormValues>({
      resolver: zodResolver(usedKeySchema),
      mode: "onChange",
      defaultValues: {
        purchasedBy: "",
        purchasedOn: "",
      },
    });

  const handleCopy = async () => {
    if (productKey && onCopyKey) {
      try {
        await onCopyKey(productKey.key);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to copy key",
          variant: "destructive",
        });
      }
    }
  };

  if (!productKey) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Key Details</DialogTitle>
          <DialogDescription>
            {productKey.status === "used"
              ? "View information about this used key"
              : "Assign this key to a business by copying it and sharing it with the Client"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Key ID */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Key ID</Label>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-muted p-2 rounded font-mono break-all">
                {productKey.key}
              </code>
              {productKey.status !== "used" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  title="Copy key"
                >
                  {isCopying ? (
                    <Loader className="loading loading-spinner animate-spin" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Status</Label>
            <Badge
              variant={productKey.status === "used" ? "default" : "secondary"}
            >
              {productKey.status}
            </Badge>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Price</Label>
            <p className="text-sm font-medium">
              Ugx {productKey.price?.toLocaleString() || "0.00"}
            </p>
          </div>
          {/* customer  */}
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Customer</Label>
            <p className="text-sm font-medium">
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-accent hover:text-accent/80"
                href={`mailto:${productKey.purchasedBy}`}
              >
                {productKey.purchasedBy || "N/A"}
              </a>
            </p>
          </div>

          {/* date  */}
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">
              Purchase Date
            </Label>
            <p className="text-sm font-medium">
              {productKey.activatedAt
                ? new Date(productKey.activatedAt).toLocaleDateString()
                : "-"}
            </p>
          </div>

          {/* {productKey.status === "used" ? (
            // Display used key details
            <>
              {productKey.purchasedBy && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Purchased By
                  </Label>
                  <p className="text-sm">{productKey.purchasedBy}</p>
                </div>
              )}

              {productKey.purchasedOn && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Purchase Date
                  </Label>
                  <p className="text-sm">
                    {new Date(productKey.purchasedOn).toLocaleDateString()}
                  </p>
                </div>
              )}

              {productKey.activatedAt && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Activated At
                  </Label>
                  <p className="text-sm">
                    {new Date(productKey.activatedAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Activated
                </Label>
                <Badge variant={productKey.activated ? "default" : "secondary"}>
                  {productKey.activated ? "Yes" : "No"}
                </Badge>
              </div>
            </>
          ) : (
            // Form to mark as used
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="purchasedBy">Purchased By (Contact) *</Label>
                <Input
                  id="purchasedBy"
                  placeholder="e.g., John Doe"
                  disabled={isSubmitting}
                  {...register("purchasedBy")}
                />
                {formState.errors.purchasedBy && (
                  <p className="text-xs text-destructive">
                    {formState.errors.purchasedBy.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchasedOn">Purchase Date *</Label>
                <Input
                  id="purchasedOn"
                  type="date"
                  disabled={isSubmitting}
                  {...register("purchasedOn")}
                />
                {formState.errors.purchasedOn && (
                  <p className="text-xs text-destructive">
                    {formState.errors.purchasedOn.message}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formState.isValid}
                >
                  {isSubmitting ? "Saving..." : "Mark as Used"}
                </Button>
              </DialogFooter>
            </form>
          )} */}
        </div>

        {productKey.status === "used" && (
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
