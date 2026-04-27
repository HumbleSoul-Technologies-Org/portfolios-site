"use client";

import { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { mockSystems } from "@/lib/mockData/systems";
import { mockKeys } from "@/lib/mockData/keys";
import {
  SystemProfile,
  ProductKey,
  FilterOptions,
  CreateSystemInput,
  MarkKeyAsUsedInput,
  KeysStats,
} from "@/lib/types/keys";
import { apiRequest } from "../queryClient";

const STORAGE_KEYS = {
  SYSTEMS: "pk-systems",
  KEYS: "pk-keys",
};

import { useQuery } from "@tanstack/react-query";

export function useKeysData() {
  const [systems, setSystems] = useState<SystemProfile[]>([]);
  const [keys, setKeys] = useState<ProductKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: systemData, error } = useQuery<any[]>({
    queryKey: ["systems", "all"],
  });

  // Initialize data from localStorage or use mock data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const savedKeys = localStorage.getItem(STORAGE_KEYS.KEYS);
        const savedSystems = localStorage.getItem(STORAGE_KEYS.SYSTEMS);

        if (systemData && systemData.length > 0) {
          setSystems(systemData as SystemProfile[]);
          localStorage.setItem(
            STORAGE_KEYS.SYSTEMS,
            JSON.stringify(systemData),
          );
        } else {
          if (savedSystems) {
            setSystems(JSON.parse(savedSystems));
          } else {
            setSystems(mockSystems);
            localStorage.setItem(
              STORAGE_KEYS.SYSTEMS,
              JSON.stringify(mockSystems),
            );
          }
        }

        if (savedKeys) {
          setKeys(JSON.parse(savedKeys));
        } else {
          setKeys(mockKeys);
          localStorage.setItem(STORAGE_KEYS.KEYS, JSON.stringify(mockKeys));
        }
      } catch (error) {
        console.error("Error loading keys data:", error);
        setSystems(mockSystems);
        setKeys(mockKeys);
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
      systems.find((sys) => sys.id === systemId)?.productKeys?.keys || [],
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
        systems.find((sys) => sys.id === systemId)?.productKeys?.keys || [];
      const combinedKeys: any = [...(existingKeys as ProductKey[]), ...newKeys];

      const updatedSystems = systems.map((sys) =>
        sys.id === systemId
          ? {
              ...sys,
              productKeys: {
                ...(sys.productKeys?.keys || { keys: [] }),
                keys: combinedKeys,
              },
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
                  productKeys: {
                    ...(sys.productKeys?.keys || { keys: [] }),
                    keys: updatedKeys,
                  },
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
      }

      return newKeys;
    },
    [systems],
  );

  // Mark key as used

  // Get stats for a system
  const getSystemStats = useCallback(
    (systemId: string): KeysStats => {
      const system = getSystemKeys(systemId);
      const usedKeys =
        system?.productKeys?.keys?.filter(
          (k: ProductKey) => k.status === "unused",
        ) || [];
      const totalIncome = usedKeys.reduce(
        (sum: number, key: any) => sum + (key.price || 0),
        0,
      );

      return {
        total: system.productKeys?.keys?.length || 0,
        used: usedKeys.length,
        unused:
          system.productKeys?.keys?.filter((k) => k.status === "unused")
            .length || 0,
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

      const res = await apiRequest("POST", "/systems/create", payload);
      let newSystem = null;

      if (res.ok) {
        const data: any = await res.json();
        newSystem = {
          id: data.savedSystem._id,
          name: data.savedSystem.name,
          description: data.savedSystem.description,
          image: data.savedSystem.image,
          link: data.savedSystem.link,
          latestVersion: data.savedSystem.latestVersion,
        };
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
    (systemId: string, updates: Partial<SystemProfile>) => {
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
    },
    [systems],
  );

  // Delete system
  const deleteSystem = useCallback(
    (systemId: string) => {
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
      return true;
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
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
    getSystemStats,
    // Utilities
    copyToClipboard,
  };
}
