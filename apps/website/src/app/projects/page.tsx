"use client";

import { useGetAllProjects } from "@/lib/hooks";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Loader2,
  AlertCircle,
  TrendingUp,
  Target,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useAccount } from "wagmi";

export default function ProjectsPage() {
  const { address: walletAddress } = useAccount();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "funded" | "ended"
  >("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { projects, meta, isLoading, error } = useGetAllProjects({
    search: debouncedSearch,
    status: statusFilter,
    limit: 50,
    offset: 0,
  });

  // Client-side filtering as backup (in case API doesn't handle all filters)
  const filteredProjects = useMemo(() => {
    if (!projects) return [];

    return projects.filter((project) => {
      // Search filter (backup - API should handle this)
      const matchesSearch =
        !searchTerm ||
        (project.title &&
          project.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.description &&
          project.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (project.owner &&
          project.owner.toLowerCase().includes(searchTerm.toLowerCase()));

      // Status filter (backup - API should handle this)
      let matchesStatus = true;
      if (statusFilter === "active") {
        matchesStatus =
          !project.isFullyFunded && project.fundingPercentage < 100;
      } else if (statusFilter === "funded") {
        matchesStatus =
          project.isFullyFunded || project.fundingPercentage >= 100;
      } else if (statusFilter === "ended") {
        // Consider a project ended if it's old or reached goal
        const isOld = Date.now() / 1000 - project.timestamp > 90 * 24 * 60 * 60; // 90 days old
        matchesStatus = isOld || project.isFullyFunded;
      }

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  const projectStats = useMemo(() => {
    if (!projects || projects.length === 0) return null;

    const totalProjects = projects.length;
    const activeProjects = projects.filter((p) => !p.isFullyFunded).length;
    const fundedProjects = projects.filter((p) => p.isFullyFunded).length;
    const totalFunding = projects.reduce(
      (sum, p) => sum + (p.fundedETH || 0),
      0
    );

    return {
      total: totalProjects,
      active: activeProjects,
      funded: fundedProjects,
      totalFunding,
    };
  }, [projects]);

  if (error) {
    return (

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-2xl font-semibold">Error Loading Projects</h2>
          <p className="text-muted-foreground text-center max-w-md">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Projects</h1>
        <p className="text-muted-foreground">
          Explore innovative projects and support creators with cryptocurrency
          funding.
        </p>
      </div>

      {/* Project Statistics */}
      {projectStats && !isLoading && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Total Projects</span>
                </div>
                <div className="text-2xl font-bold mt-2">
                  {projectStats.total}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Active</span>
                </div>
                <div className="text-2xl font-bold mt-2">
                  {projectStats.active}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Funded</span>
                </div>
                <div className="text-2xl font-bold mt-2">
                  {projectStats.funded}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Total Raised</span>
                </div>
                <div className="text-2xl font-bold mt-2">
                  {projectStats.totalFunding.toFixed(2)} ETH
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            All Projects
            {projectStats && (
              <Badge variant="secondary" className="ml-2">
                {projectStats.total}
              </Badge>
            )}
          </Button>
          <Button
            variant={statusFilter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("active")}
          >
            Active
            {projectStats && (
              <Badge variant="secondary" className="ml-2">
                {projectStats.active}
              </Badge>
            )}
          </Button>
          <Button
            variant={statusFilter === "funded" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("funded")}
          >
            Funded
            {projectStats && (
              <Badge variant="secondary" className="ml-2">
                {projectStats.funded}
              </Badge>
            )}
          </Button>
          <Button
            variant={statusFilter === "ended" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("ended")}
          >
            Ended
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          {isLoading ? (
            <span className="flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading projects...
            </span>
          ) : (
            `${filteredProjects.length} project${
              filteredProjects.length !== 1 ? "s" : ""
            } found`
          )}
          {meta && meta.total && (
            <span className="ml-2">• Total: {meta.total} projects</span>
          )}
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading projects...</span>
          </div>
        </div>
      )}

      {/* Projects Grid/List */}
      {!isLoading && filteredProjects.length > 0 && (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredProjects.map((project) => (
            <ProjectCard
              key={`${project.owner}-${project.index}`}
              id={project.id}
              project={project}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {!isLoading && meta?.hasMore && (
        <div className="flex justify-center mt-8">
          <Button variant="outline">Load More Projects</Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No projects found</h3>
          <p className="text-muted-foreground text-center max-w-md">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filters to find more projects."
              : "There are no projects available at the moment. Check back later!"}
          </p>
          {(searchTerm || statusFilter !== "all") && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
