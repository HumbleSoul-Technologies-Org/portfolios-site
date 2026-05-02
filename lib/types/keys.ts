/**
 * Types and interfaces for Product Keys Management feature
 */

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
}

export interface MarkKeyAsUsedInput {
  key: string;
  purchasedBy: string;
  purchasedOn: Date;
}
