"use client";

import { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  SystemProfile,
  ProductKey,
  FilterOptions,
  CreateSystemInput,
  MarkKeyAsUsedInput,
  KeysStats,
} from "@/lib/types/keys";
import { apiRequest } from "../queryClient";
import { toast } from "@/hooks/use-toast";

const STORAGE_KEYS = {
  SYSTEMS: "pk-systems",
  KEYS: "pk-keys",
};

import { useQuery } from "@tanstack/react-query";
import { set } from "react-hook-form";
import { useAuth } from "../useAuth";

export function useKeysData() {
  const [systems, setSystems] = useState<SystemProfile[]>([]);
  const [keys, setKeys] = useState<ProductKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, user } = useAuth();
  const { data: systemData, error } = useQuery<any[]>({
    queryKey: ["systems", "all"],
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const savedKeys = localStorage.getItem(STORAGE_KEYS.KEYS);
        const savedSystems = localStorage.getItem(STORAGE_KEYS.SYSTEMS);
        const parsedSystems = savedSystems ? JSON.parse(savedSystems) : [];

        if (Array.isArray(systemData) && systemData.length > 0) {
          setSystems(systemData as SystemProfile[]);
          localStorage.setItem(
            STORAGE_KEYS.SYSTEMS,
            JSON.stringify(systemData),
          );
        } else {
          setSystems([]);
        }

        if (savedKeys) {
          setKeys(JSON.parse(savedKeys));
        } else {
          const derivedKeys = (
            Array.isArray(systemData) && systemData.length > 0
              ? systemData
              : parsedSystems
          ).flatMap((sys: SystemProfile) => sys.productKeys || []);
          setKeys(derivedKeys);
          localStorage.setItem(STORAGE_KEYS.KEYS, JSON.stringify(derivedKeys));
        }
      } catch (error) {
        console.error("Error loading keys data:", error);
        setSystems([]);
        setKeys([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [systemData]);

  // Get all systems
  const getSystems = useCallback(() => systems, [systems]);

  // Get system by ID
  const getSystemById = useCallback(
    (systemId: string) => systems.find((sys) => sys.id === systemId),
    [systems],
  );

  // Get keys for a specific system
  const getSystemKeys = useCallback(
    (systemId: string) =>
      systems.find((sys) => sys.id === systemId)?.productKeys || [],
    [systems],
  );

  const formatKey = (uuid: string, chunkSize: number = 4) => {
    const clean = uuid.replace(/-/g, ""); // remove existing dashes
    const regex = new RegExp(`.{1,${chunkSize}}`, "g");
    return clean.match(regex)?.join("-") || clean;
  };

  // Generate new keys (create UUIDs)
  const generateKeys = useCallback(
    async (
      systemId: string,
      count: number,
      price: number = 0,
    ): Promise<ProductKey[]> => {
      const newKeys: ProductKey[] = [];

      for (let i = 0; i < count; i++) {
        const rawId = uuidv4();
        const formattedId = formatKey(rawId, 4);

        newKeys.push({
          key: formattedId,
          systemId,
          status: "unused",
          price,
          activated: false,
          purchasedBy: "",
        });
      }

      const existingKeys =
        systems.find((sys) => sys.id === systemId)?.productKeys || [];
      const combinedKeys: ProductKey[] = [...existingKeys, ...newKeys];

      const updatedSystems = systems.map((sys) =>
        sys.id === systemId
          ? {
              ...sys,
              productKeys: combinedKeys,
            }
          : sys,
      );

      setSystems(updatedSystems as SystemProfile[]);
      setKeys(combinedKeys);
      localStorage.setItem(
        STORAGE_KEYS.SYSTEMS,
        JSON.stringify(updatedSystems),
      );
      localStorage.setItem(STORAGE_KEYS.KEYS, JSON.stringify(combinedKeys));

      try {
        const res = await apiRequest(
          "POST",
          `/systems/${systemId}/keys/generate`,
          newKeys,
        );

        if (res.ok) {
          const data: any = await res.json();
          const updatedKeys = data.keys || combinedKeys;
          const syncedSystems = updatedSystems.map((sys) =>
            sys.id === systemId
              ? {
                  ...sys,
                  productKeys: updatedKeys,
                }
              : sys,
          );

          setSystems(syncedSystems as SystemProfile[]);
          setKeys(updatedKeys);
          localStorage.setItem(
            STORAGE_KEYS.SYSTEMS,
            JSON.stringify(syncedSystems),
          );
          localStorage.setItem(STORAGE_KEYS.KEYS, JSON.stringify(updatedKeys));
        }
      } catch (error) {
        console.error("Error generating keys:", error);
        toast({
          title: "Key generation failed",
          description: "Unable to sync generated keys with the API.",
          variant: "destructive",
        });
      }

      return newKeys;
    },
    [systems],
  );

  const markKeyAsUsed = useCallback(
    async (input: MarkKeyAsUsedInput) => {
      const updatedSystems = systems.map((sys) => {
        const currentKeys = sys.productKeys || [];
        if (!currentKeys.some((key) => key.key === input.key)) {
          return sys;
        }

        const updatedKeys: ProductKey[] = currentKeys.map((key) =>
          key.key === input.key
            ? {
                ...key,
                status: "used",
                activated: true,
                activatedAt: new Date(),
                purchasedBy: input.purchasedBy,
                purchasedOn: input.purchasedOn,
              }
            : key,
        );

        return {
          ...sys,
          productKeys: updatedKeys,
        };
      });

      setSystems(updatedSystems);
      const updatedKeys = updatedSystems.flatMap(
        (sys) => sys.productKeys || [],
      );
      setKeys(updatedKeys);
      localStorage.setItem(
        STORAGE_KEYS.SYSTEMS,
        JSON.stringify(updatedSystems),
      );
      localStorage.setItem(STORAGE_KEYS.KEYS, JSON.stringify(updatedKeys));
    },
    [systems],
  );

  // Get stats for a system
  const getSystemStats = useCallback(
    (systemId: string): KeysStats => {
      const keys = getSystemKeys(systemId) || [];
      const usedKeys = keys.filter((k: ProductKey) => k.status === "used");
      const unusedKeys = keys.filter((k: ProductKey) => k.status === "unused");
      const totalIncome = usedKeys.reduce(
        (sum: number, key: any) => sum + (key.price || 0),
        0,
      );

      return {
        total: keys.length,
        used: usedKeys.length,
        unused: unusedKeys.length,
        totalIncome,
      };
    },
    [getSystemKeys],
  );

  // Create new system
  const createSystem = useCallback(
    async (input: CreateSystemInput): Promise<SystemProfile> => {
      const payload: SystemProfile = {
        name: input.name,
        description: input.description,
        image: input.image,
        link: input.link,
        latestVersion: input.latestVersion || "1.0.0",
        numberOfBusinesses: 0,
      };

      let newSystem: SystemProfile = {
        id: uuidv4(),
        name: payload.name,
        description: payload.description,
        image: payload.image,
        link: payload.link,
        latestVersion: payload.latestVersion,
        numberOfBusinesses: 0,
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
      };

      try {
        const res = await apiRequest("POST", "/systems/create", payload);
        const data: any = await res.json();
        console.log("====================================");
        console.log(data);
        console.log("====================================");
        if (data?.savedSystem) {
          newSystem = {
            id: data.savedSystem.id || data.savedSystem._id || newSystem.id,
            name: data.savedSystem.name,
            description: data.savedSystem.description,
            image: data.savedSystem.image,
            link: data.savedSystem.link,
            latestVersion: data.savedSystem.latestVersion,
            numberOfBusinesses: data.savedSystem.numberOfBusinesses || 0,
          };
        }
        setSystems((prev) => [...prev, newSystem]);
        localStorage.setItem(
          STORAGE_KEYS.SYSTEMS,
          JSON.stringify([...systems, newSystem]),
        );
      } catch (error) {
        console.error("Error creating system:", error);
        toast({
          title: "Create failed",
          description: "Unable to save system profile to the API.",
          variant: "destructive",
        });
      }

      const updatedSystems = [...systems, newSystem];
      setSystems(updatedSystems as SystemProfile[]);
      localStorage.setItem(
        STORAGE_KEYS.SYSTEMS,
        JSON.stringify(updatedSystems),
      );

      return newSystem as SystemProfile;
    },
    [systems],
  );

  // Update system
  const updateSystem = useCallback(
    async (systemId: string, updates: Partial<SystemProfile>) => {
      const updatedSystems = systems.map((sys) =>
        sys.id === systemId
          ? { ...sys, ...updates, lastUpdatedAt: new Date() }
          : sys,
      );

      setSystems(updatedSystems);
      localStorage.setItem(
        STORAGE_KEYS.SYSTEMS,
        JSON.stringify(updatedSystems),
      );

      try {
        await apiRequest("PUT", `/systems/${systemId}/update`, updates);
      } catch (error) {
        console.error("Error updating system:", error);
        toast({
          title: "Update failed",
          description: "Unable to save changes to the API.",
          variant: "destructive",
        });
      }

      return updatedSystems.find((sys) => sys.id === systemId);
    },
    [systems],
  );

  // Delete system
  const deleteSystem = useCallback(
    async (systemId: string, password: string) => {
      try {
        const res = await apiRequest("DELETE", `/systems/${systemId}/delete`, {
          password,
          userId: user?.id,
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData?.error || "Failed to delete system");
        } else {
          toast({
            title: "System deleted",
            description: "The system profile was removed successfully.",
            variant: "default",
          });
          setSystems((prev) => prev.filter((sys) => sys.id !== systemId));
        }
      } catch (error) {
        console.error("Error deleting system:", error);
        toast({
          title: "Delete failed",
          description: "Unable to remove system from the API.",
          variant: "destructive",
        });
      }

      const updatedSystems = systems.filter((sys) => sys.id !== systemId);
      const updatedKeys = keys.filter((key) => key.systemId !== systemId);

      setSystems(updatedSystems);
      setKeys(updatedKeys);
      localStorage.setItem(
        STORAGE_KEYS.SYSTEMS,
        JSON.stringify(updatedSystems),
      );
      localStorage.setItem(STORAGE_KEYS.KEYS, JSON.stringify(updatedKeys));
    },
    [systems, keys],
  );

  // Copy to clipboard
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "The key has been copied successfully.",
        variant: "default",
      });
      return true;
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      toast({
        title: "Copy failed",
        description: "Unable to copy the key. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  return {
    // State
    systems,
    keys,
    isLoading,
    // System methods
    getSystems,
    getSystemById,
    createSystem,
    updateSystem,
    deleteSystem,
    // Key methods
    getSystemKeys,
    generateKeys,
    markKeyAsUsed,
    getSystemStats,
    // Utilities
    copyToClipboard,
  };
}
