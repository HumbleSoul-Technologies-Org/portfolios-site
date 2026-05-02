import { SystemProfile, ProductKey } from "@/lib/types/keys";

const systems: SystemProfile[] = [];

function getAllSystems(): SystemProfile[] {
  return systems;
}

function getSystemById(systemId: string): SystemProfile | undefined {
  return systems.find((system) => system.id === systemId || system._id === systemId);
}

function createSystem(payload: Partial<SystemProfile>): SystemProfile {
  const newSystem: SystemProfile = {
    id: payload.id || crypto.randomUUID(),
    name: payload.name || "Untitled System",
    description: payload.description || "",
    image: payload.image || "",
    link: payload.link || "",
    latestVersion: payload.latestVersion || "1.0.0",
    numberOfBusinesses: payload.numberOfBusinesses || 0,
    productKeys: payload.productKeys || [],
    createdAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
  };
  systems.push(newSystem);
  return newSystem;
}

function updateSystem(systemId: string, updates: Partial<SystemProfile>): SystemProfile | undefined {
  const existing = getSystemById(systemId);
  if (!existing) {
    return undefined;
  }

  const updatedSystem: SystemProfile = {
    ...existing,
    ...updates,
    lastUpdatedAt: new Date().toISOString(),
  };

  const index = systems.findIndex((system) => system.id === systemId || system._id === systemId);
  if (index !== -1) {
    systems[index] = updatedSystem;
  }

  return updatedSystem;
}

function deleteSystem(systemId: string): boolean {
  const index = systems.findIndex((system) => system.id === systemId || system._id === systemId);
  if (index === -1) {
    return false;
  }
  systems.splice(index, 1);
  return true;
}

function generateSystemKeys(systemId: string, newKeys: ProductKey[]): ProductKey[] | undefined {
  const system = getSystemById(systemId);
  if (!system) {
    return undefined;
  }

  const existingKeys = system.productKeys || [];
  const updatedKeys = [...existingKeys, ...newKeys];
  system.productKeys = updatedKeys;
  system.lastUpdatedAt = new Date().toISOString();
  return updatedKeys;
}

export {
  getAllSystems,
  getSystemById,
  createSystem,
  updateSystem,
  deleteSystem,
  generateSystemKeys,
};
