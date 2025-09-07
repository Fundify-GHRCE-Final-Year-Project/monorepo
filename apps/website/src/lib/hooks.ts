// lib/hooks.ts - Add these hooks to your existing hooks file

import { useAtom } from "jotai";
import { currentUserAtom } from "@/store/global";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Project } from "@fundify/types";
import { IProject } from "@fundify/database/src/models/models";

// lib/api.ts
export async function fetchUserByWallet(wallet: string | undefined | null) {
  if (!wallet) return null;
  const res = await fetch(`/api/user/${wallet}`, { cache: "no-store" });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Failed to fetch user");
  }
  return res.json();
}

type InvestmentDTO = {
  funder: string;
  investmentIndex: number;
  projectOwner: string;
  projectIndex: number;
  amount: string; // BigInt serialized as string
  timestamp: number;
  id?: string;
  project?: any; // joined project snapshot
};

export function useGetInvestedProjects() {
  const [currentUser] = useAtom(currentUserAtom);
  const address = currentUser?.wallet || currentUser?.wallet;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [investments, setInvestments] = useState<InvestmentDTO[]>([]);

  useEffect(() => {
    if (!address) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/users/${address}/investments`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (!res.ok || !json.ok) {
          throw new Error(json.error || "Failed to load investments");
        }
        setInvestments(json.data);
      } catch (e: any) {
        setError(e.message || "Failed to load investments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [address]);

  // Return unique invested projects
  const projects = useMemo(() => {
    const byKey = new Map<string, any>();
    for (const inv of investments) {
      const p = inv.project;
      if (!p) continue;
      const key = `${p.owner.toLowerCase()}#${p.index}`;
      if (!byKey.has(key)) {
        byKey.set(key, p);
      }
    }
    return Array.from(byKey.values());
  }, [investments]);

  return { projects, investments, isLoading, error };
}

// ---- Fetch user's own projects ----
export function useGetUserProjects() {
  const [currentUser] = useAtom(currentUserAtom);
  const address = currentUser?.wallet;

  console.log("Fetching projects for:", address);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    if (!address) {
      console.log("useGetUserProjects: No address found");
      setProjects([]);
      return;
    }

    const fetchData = async () => {
      console.log(
        "useGetUserProjects: Fetching projects for address:",
        address
      );
      setIsLoading(true);
      setError(null);

      try {
        const apiUrl = `/api/users/${address}/projects`;
        console.log("useGetUserProjects: API URL:", apiUrl);

        const res = await fetch(apiUrl, {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("useGetUserProjects: Response status:", res.status);

        const json = await res.json();
        console.log("useGetUserProjects: Response data:", json);

        if (!res.ok || !json.ok) {
          throw new Error(
            json.error || `HTTP ${res.status}: Failed to load projects`
          );
        }

        setProjects(json.data || []);
        console.log(
          "useGetUserProjects: Successfully set projects:",
          json.data?.length || 0
        );
      } catch (e: any) {
        console.error("useGetUserProjects: Error:", e);
        setError(e.message || "Failed to load projects");
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [address]);

  return { projects, isLoading, error };
}

// ---- Fetch specific project ----
export function useGetProject(projectIndex: number) {
  const [currentUser] = useAtom(currentUserAtom);
  const address = currentUser?.wallet;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    if (!address || projectIndex === undefined) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/users/${address}/projects/${projectIndex}`,
          {
            cache: "no-store",
          }
        );
        const json = await res.json();
        if (!res.ok || !json.ok) {
          throw new Error(json.error || "Failed to load project");
        }
        setProject(json.data);
      } catch (e: any) {
        setError(e.message || "Failed to load project");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [address, projectIndex]);

  return { project, isLoading, error };
}

// ---- Fetch project investments ----
export function useGetProjectInvestments(projectIndex: number) {
  const [currentUser] = useAtom(currentUserAtom);
  const address = currentUser?.wallet;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!address || projectIndex === undefined) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/users/${address}/projects/${projectIndex}/investments`,
          {
            cache: "no-store",
          }
        );
        const json = await res.json();
        if (!res.ok || !json.ok) {
          throw new Error(json.error || "Failed to load project investments");
        }
        setData(json.data);
      } catch (e: any) {
        setError(e.message || "Failed to load project investments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [address, projectIndex]);

  return {
    project: data?.project,
    investments: data?.investments || [],
    totalInvestments: data?.totalInvestments || 0,
    totalAmount: data?.totalAmount || "0",
    isLoading,
    error,
  };
}

type ProjectFilters = {
  search?: string;
  status?: "all" | "active" | "funded" | "ended";
  limit?: number;
  offset?: number;
};

export function useGetAllProjects(filters: ProjectFilters = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);

  const { search, status = "all", limit = 50, offset = 0 } = filters;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Send filters in POST body (no URL params)
        const res = await fetch(`/api/projects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          body: JSON.stringify({
            search,
            status,
            limit,
            offset,
          }),
        });

        const json = await res.json();

        if (!res.ok || !json.ok) {
          console.log(json);
          throw new Error(json.error || "Failed to load projects");
        }

        setProjects(json.data);
        setMeta(json.meta);
      } catch (e: any) {
        setError(e.message || "Failed to load projects");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [search, status, limit, offset]);

  return { projects, meta, isLoading, error };
}

// Simple version without filters (for backward compatibility)
export function useGetAllProjectsSimple() {
  return useGetAllProjects();
}

export function useGetSelectedProject(owner: string, index: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<IProject | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Send filters in POST body (no URL params)
        const res = await fetch(`/api/projects/${owner}/${index}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        const json = await res.json();

        if (!res.ok || !json.ok) {
          toast.error("Server Error", {
            description: json.error || "Failed to load project",
          });
        }

        setProject(json.data);
      } catch (e: any) {
        setError(e.message || "Failed to load projects");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [owner, index]);

  return { project, isLoading, error };
}
