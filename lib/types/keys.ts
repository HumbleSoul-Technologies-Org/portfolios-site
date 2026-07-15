/**
 * Types and interfaces for Product Keys Management feature
 */

export interface SystemTier {
  _id?: string;
  name: string;
  level: number;
  features?: string;
  pricePerKey?: number;
  isActive?: boolean;
}

export interface SystemProfile {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  image: string;
  link: string;
  latestVersion: string;
  numberOfBusinesses: number;
  productKeys?: ProductKeysContainer | ProductKey[];
  tiers?: SystemTier[];
  createdAt?: Date;
  lastUpdatedAt?: Date;
  updatedAt?: Date;
}

export interface ProductKeysContainer {
  keys: ProductKey[];
}

export interface ProductKey {
  systemId: string;
  key: string; // The UUID key
  status: "used" | "unused";
  tierId?: string;
  tierName?: string;
  tierLevel?: number;
  price: number; // Price of the key in USD
  activated: boolean;
  activatedAt?: Date;
  purchasedBy: string;
  purchasedOn?: Date;
}

export interface KeysStats {
  total: number;
  used: number;
  unused: number;
  totalIncome: number; // Total income from sold/activated keys
}

export interface FilterOptions {
  status?: "used" | "unused" | "all";
  searchText?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface CreateSystemInput {
  name: string;
  description: string;
  image: string;
  link: string;
  latestVersion?: string;
}

export interface CreateKeyInput {
  systemId: string;
  count: number;
  price: number; // Price per key in USD
  tierId?: string;
  tierLevel?: number;
  tierName?: string;
}

export interface MarkKeyAsUsedInput {
  key: string;
  purchasedBy: string;
  purchasedOn: Date;
}
