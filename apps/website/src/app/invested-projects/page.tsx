// app/invested-projects/page.tsx (Updated version)
"use client";

import { useGetInvestedProjects } from "@/lib/hooks";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Grid3X3,
  List,
  Loader2,
  AlertCircle,
  TrendingUp,
  Wallet,
  BarChart3,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useAtom } from "jotai";
import { currentUserAtom } from "@/store/global";

export default function InvestedProjectsPage() {
  const { projects, investments, isLoading, error } = useGetInvestedProjects();
  const [currentUser] = useAtom(currentUserAtom);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProjects =
    projects?.filter((project: any) => {
      const title = (project.title ?? "").toLowerCase();
      const description = (project.description ?? "").toLowerCase();
      const owner = (project.owner ?? "").toLowerCase();
      const indexStr = String(project.index ?? "");
      const term = searchTerm.toLowerCase();
      return (
        title.includes(term) ||
        description.includes(term) ||
        owner.includes(term) ||
        indexStr.includes(term)
      );
    }) || [];

  // Calculate investment statistics
  const investmentStats = useMemo(() => {
    if (!investments || investments.length === 0) {
      return {
        totalInvested: 0,
        totalInvestments: 0,
        averageInvestment: 0,
      };
    }

    const total = investments.reduce((sum, inv) => {
      try {
        // Convert BigInt string to ETH
        const ethAmount = parseFloat(inv.amount);
        return sum + ethAmount;
      } catch {
        return sum;
      }
    }, 0);

    return {
      totalInvested: total,
      totalInvestments: investments.length,
      averageInvestment: total / investments.length,
    };
  }, [investments]);

  const formatAddress = (address: string) => {
    if (!address) return "Unknown";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
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
          <h2 className="text-2xl font-semibold">
            Error Loading Invested Projects
          </h2>
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
        <h1 className="text-3xl font-bold mb-2">My Invested Projects</h1>
        <p className="text-muted-foreground">
          Track the projects you've invested in and monitor their progress.
        </p>
      </div>

      {/* Investment Summary */}
      {!isLoading && (investments?.length || 0) > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm font-medium">Total Invested</span>
                </div>
                <div className="text-2xl font-bold">
                  {investmentStats.totalInvested.toFixed(4)} ETH
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-sm font-medium">Total Investments</span>
                </div>
                <div className="text-2xl font-bold">
                  {investmentStats.totalInvestments}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Wallet className="h-5 w-5" />
                  <span className="text-sm font-medium">Active Projects</span>
                </div>
                <div className="text-2xl font-bold">
                  {filteredProjects.length}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      {!isLoading && (
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search invested projects..."
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

      {/* Results Count */}
      {!isLoading && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {`${filteredProjects.length} project${filteredProjects.length !== 1 ? "s" : ""} found`}
            {investments && investments.length > 0 && (
              <span className="ml-2">
                • {investments.length} total investment
                {investments.length !== 1 ? "s" : ""}
              </span>
            )}
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading invested projects...</span>
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
          {filteredProjects.map((project) => {
            // Find user's investments in this project
            const userInvestments =
              investments?.filter(
                (inv) =>
                  inv.projectOwner.toLowerCase() ===
                    project.owner.toLowerCase() &&
                  inv.projectIndex === project.index
              ) || [];

            const totalUserInvestment = userInvestments.reduce((sum, inv) => {
              try {
                const ethAmount = parseFloat(inv.amount);
                return sum + ethAmount;
              } catch {
                return sum;
              }
            }, 0);

            return (
              <div
                key={`${project.owner}-${project.index}`}
                className="relative"
              >
                <ProjectCard project={project} viewMode={viewMode} />
                {/* Investment Badge */}
                <div className="absolute top-2 right-2">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 border-green-200"
                  >
                    Invested: {totalUserInvestment.toFixed(4)} ETH
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Investment History Section */}
      {!isLoading && investments && investments.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Investment History</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {investments
              .sort((a, b) => b.timestamp - a.timestamp) // Sort by newest first
              .slice(0, 10) // Show only recent 10 investments
              .map((investment) => (
                <Card
                  key={`${investment.funder}-${investment.investmentIndex}`}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Wallet className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          Project by {formatAddress(investment.projectOwner)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Project #{investment.projectIndex} •{" "}
                          {new Date(
                            investment.timestamp * 1000
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {parseFloat(investment.amount).toFixed(4)} ETH
                      </p>
                      <Badge variant="outline" className="text-xs">
                        Investment #{investment.investmentIndex}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No invested projects found</h3>
          <p className="text-muted-foreground text-center max-w-md">
            {searchTerm
              ? "Try adjusting your search to find your invested projects."
              : "You haven't invested in any projects yet. Start exploring and investing in exciting projects!"}
          </p>
          {searchTerm && (
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          )}
          {!searchTerm && (
            <Button asChild>
              <a href="/projects">Browse Projects</a>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
