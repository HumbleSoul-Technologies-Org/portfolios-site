"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductKey, SystemTier } from "@/lib/types/keys";
import { toast } from "@/hooks/use-toast";
import { Plus, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const createKeySchema = z.object({
  count: z
    .number()
    .min(1, "Must generate at least 1 key")
    .max(100, "Cannot generate more than 100 keys at once"),
  price: z
    .number()
    .min(0, "Price cannot be negative")
    .max(10000000, "Price cannot exceed 10,000,000 UGX"),
});

type CreateKeyFormValues = z.infer<typeof createKeySchema>;

interface KeyCreationFormProps {
  systemId: string;
  tiers?: SystemTier[];
  onKeysGenerated?: (count: number) => void;
  generateKeys: (
    systemId: string,
    count: number,
    price: number,
    tier?: SystemTier,
  ) => Promise<ProductKey[]>;
  isLoading?: boolean;
}

export function KeyCreationForm({
  isLoading,
  systemId,
  tiers = [],
  onKeysGenerated,
  generateKeys,
}: KeyCreationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(isLoading || false);
  const [selectedTier, setSelectedTier] = useState<SystemTier | undefined>(
    tiers[0],
  );

  React.useEffect(() => {
    if (tiers.length === 0) {
      setSelectedTier(undefined);
      return;
    }

    const isStillValid = tiers.some(
      (tier) =>
        (tier._id && selectedTier?._id && tier._id === selectedTier._id) ||
        (!tier._id && selectedTier?.name && tier.name === selectedTier.name),
    );

    if (!selectedTier || !isStillValid) {
      setSelectedTier(tiers[0]);
    }
  }, [selectedTier, tiers]);

  const { register, handleSubmit, formState, reset, setValue } =
    useForm<CreateKeyFormValues>({
      resolver: zodResolver(createKeySchema),
      defaultValues: {
        count: 1,
        price: 0,
      },
    });

  const onSubmit = async (values: CreateKeyFormValues) => {
    setIsSubmitting(true);
    try {
      await generateKeys(systemId, values.count, values.price, selectedTier);

      toast({
        title: "Keys Generated!",
        description: `Successfully generated ${values.count} new key${values.count > 1 ? "s" : ""} for $${values.price} each`,
        variant: "default",
      });

      reset({ count: 1, price: 0 });
      onKeysGenerated?.(values.count);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate keys. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Generate New Keys
        </CardTitle>
        <CardDescription>
          Create new primary keys for this system. Set the price per key and
          quantity to generate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tier">Tier</Label>
              <Select
                value={selectedTier?._id || selectedTier?.name || ""}
                onValueChange={(value) => {
                  const tier = tiers.find(
                    (item) => item._id === value || item.name === value,
                  );
                  setSelectedTier(tier);
                  if (tier?.pricePerKey !== undefined) {
                    setValue("price", tier.pricePerKey ?? 0);
                  }
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger id="tier">
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  {tiers.length > 0 ? (
                    tiers.map((tier) => (
                      <SelectItem
                        key={tier._id || tier.name}
                        value={tier._id || tier.name}
                      >
                        {tier.name} (Level {tier.level})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none">No tiers available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="count">Number of Keys</Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="100"
                disabled={isSubmitting}
                {...register("count", { valueAsNumber: true })}
              />
              {formState.errors.count && (
                <p className="text-sm text-destructive">
                  {formState.errors.count.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price per Key (UGX)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="10"
                disabled={isSubmitting}
                {...register("price", { valueAsNumber: true })}
              />
              {formState.errors.price && (
                <p className="text-sm text-destructive">
                  {formState.errors.price.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !formState.isValid}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Keys...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Generate Keys
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
