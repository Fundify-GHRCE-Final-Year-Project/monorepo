// lib/hooks.ts - Updated hooks with fixes

import { useAtom } from "jotai";
import { currentUserAtom } from "@/store/global";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Project } from "@fundify/types";
import { IProject } from "@fundify/database/src/models/models";
import { useAccount } from "wagmi";

// lib/api.ts
export async function fetchUserByWallet(wallet: string | undefined | null) {
  if (!wallet) return null;
  try {
    const res = await fetch(`/api/user/${wallet}`, { cache: "no-store" });
    if (!res.ok) {
      console.warn(`Failed to fetch user for wallet ${wallet}:`, res.status);
      return null; // Return null instead of throwing error
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching user by wallet:", error);
    return null;
  }
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

// export function useGetInvestedProjects() {
//   const { address: walletAddress } = useAccount();

//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [investments, setInvestments] = useState<InvestmentDTO[]>([]);
//   const [enrichedInvestments, setEnrichedInvestments] = useState<InvestmentDTO[]>([]);

//   // Step 1: Fetch initial investments
//   useEffect(() => {
//     if (!walletAddress) return;

//     const fetchInvestments = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const res = await fetch(`/api/users/0x70997970C51812dc3A010C7d01b50e0d17dc79C8/investments`, {
//           cache: "no-store",
//         });
//         console.log("res ",res);
//         const json = await res.json();
//         if (!res.ok || !json.ok) {
//           throw new Error(json.error || "Failed to load investments");
//         }
//         setInvestments(json.data);
//       } catch (e: any) {
//         setError(e.message || "Failed to load investments");
//         setIsLoading(false);
//       }
//     };

//     fetchInvestments();
//   }, [walletAddress]);

//   // Step 2: Fetch missing project data for investments with project: null
//   useEffect(() => {
//     if (investments.length === 0) {
//       setIsLoading(false);
//       return;
//     }

//     const enrichInvestments = async () => {
//       try {
//         // Find investments that need project data (project is null)
//         const investmentsNeedingData = investments.filter(inv => inv.project === null);
        
//         if (investmentsNeedingData.length === 0) {
//           // All investments already have project data
//           setEnrichedInvestments(investments);
//           setIsLoading(false);
//           return;
//         }

//         // Create a map to store fetched projects
//         const projectCache = new Map<string, IProject>();

//         // Fetch project data for each investment that needs it
//         const fetchPromises = investmentsNeedingData.map(async (inv) => {
//           const cacheKey = `${inv.projectOwner}-${inv.projectIndex}`;
          
//           // Skip if already in cache
//           if (projectCache.has(cacheKey)) {
//             return null;
//           }

//           try {
//             // Construct projectId - adjust this based on your API requirement
//             // You might need to fetch by owner+index or have a different identifier
//             const res = await fetch(`/api/project/${inv.projectIndex}`, {
//               cache: "no-store",
//             });
//             const json = await res.json();
            
//             if (res.ok && json.ok && json.data) {
//               projectCache.set(cacheKey, json.data);
//               return json.data;
//             }
//           } catch (e) {
//             console.error(`Failed to fetch project ${cacheKey}:`, e);
//           }
//           return null;
//         });

//         // Wait for all fetches to complete
//         await Promise.all(fetchPromises);

//         // Enrich investments with fetched project data
//         const enriched = investments.map(inv => {
//           if (inv.project !== null) {
//             // Already has project data
//             return inv;
//           }

//           const cacheKey = `${inv.projectOwner}-${inv.projectIndex}`;
//           const fetchedProject = projectCache.get(cacheKey);

//           if (fetchedProject) {
//             return {
//               ...inv,
//               project: fetchedProject,
//             };
//           }

//           // Still no project data available
//           return inv;
//         });

//         setEnrichedInvestments(enriched);
//       } catch (e: any) {
//         console.error("Error enriching investments:", e);
//         // Use original investments if enrichment fails
//         setEnrichedInvestments(investments);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     enrichInvestments();
//   }, [investments]);

//   // Extract unique projects from enriched investments
//   const projects = useMemo(() => {
//     const byKey = new Map<string, IProject>();
    
//     for (const inv of enrichedInvestments) {
//       const p = inv.project;
//       if (!p) continue;
      
//       const key = `${p.owner.toLowerCase()}#${p.index}`;
//       if (!byKey.has(key)) {
//         byKey.set(key, p);
//       }
//     }
    
//     return Array.from(byKey.values());
//   }, [enrichedInvestments]);

//   return { 
//     projects, 
//     investments: enrichedInvestments, 
//     isLoading, 
//     error 
//   };
// }

// ---- Fetch user's own projects ----

export function useGetInvestedProjects() {
  const { address: walletAddress } = useAccount();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [investments, setInvestments] = useState<InvestmentDTO[]>([]);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchInvestments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/users/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266/investments`, {
          cache: "no-store",
        });
        const json = await res.json();
        
        if (!res.ok || !json.ok) {
          throw new Error(json.error || "Failed to load investments");
        }
        
        setInvestments(json.data || []);
      } catch (e: any) {
        setError(e.message || "Failed to load investments");
        setInvestments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestments();
  }, [walletAddress]);

  // Extract unique projects from investments
  const projects = useMemo(() => {
    const byKey = new Map<string, IProject>();
    
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

  return { 
    projects, 
    investments, 
    isLoading, 
    error 
  };
}

export function useGetUserProjects(walletAddress:string) {
  // const [currentUser] = useAtom(currentUserAtom);
  // const { address: walletAddress } = useAccount();
  const address = walletAddress;

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
        const apiUrl = `/api/users/${walletAddress}/projects`;
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
export function useGetProject(projectId: string | null) {
  const { address: walletAddress } = useAccount();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<IProject | null>(null);

  useEffect(() => {
    if (!walletAddress || !projectId === undefined) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/project/${projectId}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json.error || "Failed");
        setProject(json.data);
      } catch (e: any) {
        setError(e.message || "Failed to load project");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [walletAddress, projectId]);

  return { project, isLoading, error };
}

// ---- Fetch project investments ----
export function useGetProjectInvestments(projectIndex: string | null) {
  // const [currentUser] = useAtom(currentUserAtom);
  // const address = currentUser?.wallet;

  const { address: walletAddress } = useAccount();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!walletAddress || projectIndex === null || projectIndex === undefined) {
      console.log("useGetProjectInvestments: Missing requirements", {
        walletAddress,
        projectIndex,
      });
      return;
    }

    const fetchData = async () => {
      console.log(
        `useGetProjectInvestments: Fetching investments for project ${projectIndex}`
      );
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/users/${walletAddress}/projects/${projectIndex}/investments`,
          {
            cache: "no-store",
          }
        );
        console.log("useGetProjectInvestments response:", res.status);
        const json = await res.json();
        console.log("useGetProjectInvestments data:", json);
        if (!res.ok || !json.ok) {
          throw new Error(json.error || "Failed to load project investments");
        }
        setData(json.data);
      } catch (e: any) {
        console.error("useGetProjectInvestments error:", e);
        setError(e.message || "Failed to load project investments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [walletAddress, projectIndex]);

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
