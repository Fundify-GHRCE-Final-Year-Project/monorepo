// app/invested-projects/page.tsx
"use client";

import { useGetInvestedProjects, useGetProject } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Grid3X3,
  List,
  Loader2,
  AlertCircle,
  TrendingUp,
  Wallet,
  BarChart3,
  ArrowRight,
  Calendar,
  Target,
  DollarSign,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useAtom } from "jotai";
import { currentUserAtom } from "@/store/global";
import Link from "next/link";

export default function InvestedProjectsPage() {
  const { projects, investments, isLoading, error } = useGetInvestedProjects();

  console.log("investments ", investments);
  console.log("projects", projects);

  const [currentUser] = useAtom(currentUserAtom);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter investments and group by project
  const investmentsByProject = useMemo(() => {
    if (!investments) return new Map();

    const grouped = new Map();
    investments.forEach((inv) => {
      const key = `${inv.projectOwner}-${inv.projectIndex}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key).push(inv);
    });
    return grouped;
  }, [investments]);

  // Calculate investment statistics
  const investmentStats = useMemo(() => {
    if (!investments || investments.length === 0) {
      return {
        totalInvested: 0,
        totalInvestments: 0,
        activeProjects: 0,
        projectsWithData: 0,
      };
    }

    const total = investments.reduce(
      (sum, inv) => sum + Number(inv.amount || 0),
      0
    );
    const uniqueProjects = new Set(
      investments.map((inv) => `${inv.projectOwner}-${inv.projectIndex}`)
    );
    const projectsWithData = investments.filter(
      (inv) => inv.project !== null
    ).length;

    return {
      totalInvested: total,
      totalInvestments: investments.length,
      activeProjects: uniqueProjects.size,
      projectsWithData,
    };
  }, [investments]);

  // Filter investments based on search
  const filteredInvestments = useMemo(() => {
    if (!investments) return [];

    return investments.filter((inv) => {
      const term = searchTerm.toLowerCase();
      const projectTitle = inv.project?.title?.toLowerCase() || "";
      const projectDesc = inv.project?.description?.toLowerCase() || "";
      const owner = inv.projectOwner.toLowerCase();
      const indexStr = String(inv.projectIndex);

      return (
        projectTitle.includes(term) ||
        projectDesc.includes(term) ||
        owner.includes(term) ||
        indexStr.includes(term)
      );
    });
  }, [investments, searchTerm]);

  const formatAddress = (address: string) => {
    if (!address) return "Unknown";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateProgress = (funded: number, goal: number) => {
    if (!goal) return 0;
    return Math.min((funded / goal) * 100, 100);
  };

  if (!currentUser?.wallet) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Wallet className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-2xl font-semibold">Wallet Not Connected</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Please connect your wallet to view your invested projects.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-2xl font-semibold">Error Loading Investments</h2>
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
        <h1 className="text-3xl font-bold mb-2">My Investments</h1>
        <p className="text-muted-foreground">
          Track and manage all your project investments in one place
        </p>
      </div>

      {/* Investment Summary Cards */}
      {!isLoading && investments && investments.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm font-medium opacity-90">
                    Total Invested
                  </span>
                </div>
                <div className="text-3xl font-bold">
                  {investmentStats.totalInvested.toFixed(4)} ETH
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-sm font-medium opacity-90">
                    Total Investments
                  </span>
                </div>
                <div className="text-3xl font-bold">
                  {investmentStats.totalInvestments}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Wallet className="h-5 w-5" />
                  <span className="text-sm font-medium opacity-90">
                    Active Projects
                  </span>
                </div>
                <div className="text-3xl font-bold">
                  {investmentStats.activeProjects}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-sm font-medium opacity-90">
                    Avg Investment
                  </span>
                </div>
                <div className="text-3xl font-bold">
                  {(
                    investmentStats.totalInvested /
                    investmentStats.totalInvestments
                  ).toFixed(4)}{" "}
                  ETH
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Search and View Controls */}
      {!isLoading && investments && investments.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by project name, owner, or index..."
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
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-muted-foreground">
              Loading your investments...
            </span>
          </div>
        </div>
      )}

      {/* Investment Cards */}
      {!isLoading && filteredInvestments.length > 0 && (
        <>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredInvestments.length} of {investments?.length || 0}{" "}
              investments
            </p>
          </div>

          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredInvestments.map((investment) => {
              const project = investment.project;
              const projectKey = `${investment.projectOwner}-${investment.projectIndex}`;
              const allProjectInvestments =
                investmentsByProject.get(projectKey) || [];
              const totalInvested = allProjectInvestments.reduce(
                (sum: number, inv: typeof investment) =>
                  sum + Number(inv.amount || 0),
                0
              );

              return (
                <Card
                  key={investment.id}
                  className="hover:shadow-2xl transition-shadow p-6 rounded-2xl"
                >
                  <CardContent className="space-y-6">
                    {project ? (
                    <>
  {/* Project Title */}
  <p className="text-gray-900 font-semibold text-xl line-clamp-2 leading-snug">
    {project.title}
  </p>

  {/* Project Description */}
  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
    {project.description}
  </p>

  {/* Investment Info */}
  <div className="space-y-3">
    <div className="flex items-center justify-between text-base">
      <span className="text-muted-foreground">Your Investment</span>
      <span className="font-semibold text-green-600 text-lg">
        {totalInvested.toFixed(4)} ETH
      </span>
    </div>

    {/* Progress Bar */}
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-muted-foreground">Progress</span>
        <span className="font-medium text-sm">
          {project.fundedETH?.toFixed(2) || 0} /{" "}
          {project.goalETH?.toFixed(2) || 0} ETH
        </span>
      </div>
      <div className="w-full bg-gray-300 rounded-full h-2.5">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all"
          style={{
            width: `${calculateProgress(
              project.fundedETH || 0,
              project.goalETH || 1
            )}%`,
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1 font-medium">
        {calculateProgress(
          project.fundedETH || 0,
          project.goalETH || 1
        ).toFixed(1)}
        % funded
      </p>
    </div>

    {/* Project Stats */}
    <div className="grid grid-cols-2 gap-4 pt-3 border-t">
      <div className="space-y-1">
        <div className="flex items-center text-xs text-muted-foreground">
          <Target className="h-3.5 w-3.5 mr-1" />
          Milestones
        </div>
        <p className="text-base font-semibold">{project.milestones || 0}</p>
      </div>
      <div className="space-y-1">
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          Invested
        </div>
        <p className="text-base font-medium">
          {formatDate(investment.timestamp)}
        </p>
      </div>
    </div>
  </div>

  {/* View Project Button */}
  <Link href={`/projects/${project.id}`}>
    <Button className="w-full text-base py-2.5 mt-3" variant="default">
      <Eye className="h-4 w-4 mr-2" />
      View Project Details
      <ArrowRight className="h-4 w-4 ml-2" />
    </Button>
  </Link>
</>

                    ) : (
                      <>
                        {/* No Project Data Available */}
                        <div className="py-10 text-center space-y-4">
                          <AlertTriangle className="h-14 w-14 text-yellow-500 mx-auto" />
                          <p className="text-base text-muted-foreground">
                            Project data is not available
                          </p>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-base">
                              <span className="text-muted-foreground">
                                Your Investment
                              </span>
                              <span className="font-bold text-green-600">
                                {Number(investment.amount).toFixed(4)} ETH
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-base">
                              <span className="text-muted-foreground">
                                Invested On
                              </span>
                              <span className="font-semibold">
                                {formatDate(investment.timestamp)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-base">
                              <span className="text-muted-foreground">
                                Project Index
                              </span>
                              <span className="font-semibold">
                                #{investment.projectIndex}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Multiple Investments Badge */}
                    {allProjectInvestments.length > 1 && (
                      <Badge
                        variant="secondary"
                        className="w-full justify-center text-base py-2 mt-3"
                      >
                        {allProjectInvestments.length} investments in this
                        project
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Empty State */}
      {!isLoading && (!investments || investments.length === 0) && (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center">
            <TrendingUp className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold">No Investments Yet</h3>
          <p className="text-muted-foreground text-center max-w-md">
            You haven't invested in any projects yet. Start exploring and
            support exciting projects!
          </p>
          <Link href="/projects">
            <Button size="lg">
              Browse Projects
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}

      {/* No Search Results */}
      {!isLoading &&
        investments &&
        investments.length > 0 &&
        filteredInvestments.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
            <Search className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-semibold">No investments found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Try adjusting your search to find your investments
            </p>
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          </div>
        )}
    </div>
  );
}
