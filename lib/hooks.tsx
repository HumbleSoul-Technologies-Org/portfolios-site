"use client";

import { useQuery } from "@tanstack/react-query";
import { fetcher } from "./fetcher";

export function useProjects() {
  return useQuery(["projects"], () => fetcher<any>("/api/projects"));
}
