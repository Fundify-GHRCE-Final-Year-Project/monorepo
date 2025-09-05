"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Target, TrendingUp, User, ExternalLink } from "lucide-react";

// Updated interface to match API response
interface Project {
  id: string;
  owner: string;
  index: number;
  title: string;
  description: string;
  goal?: number;
  goalETH: number;
  funded?: number;
  fundedETH: number;
  milestones: number;
  timestamp: number;
}

interface ProjectCardProps {
  project: Project;
  viewMode?: "grid" | "list";
}

export function ProjectCard({ project, viewMode = "grid" }: ProjectCardProps) {
  // Safely calculate funding percentage with fallbacks
  const calculateFundingPercentage = () => {
    if (!project.goalETH || project.goalETH === 0) return 0;
    const funded = project.fundedETH || 0;
    const goal = project.goalETH;
    return Math.min((funded / goal) * 100, 100);
  };

  const fundingPercentage = calculateFundingPercentage();
  const isFullyFunded = fundingPercentage >= 100;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleViewProject = () => {
    console.log("View project:", project);
    // createdAt: "2025-08-22T09:18:41.153Z"
    // description: "Project by 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
    // funded: 8
    // fundedETH: 8e-18
    // fundingPercentage: 80
    // goal: 10
    // goalETH: 1e-17
    // id: "68a835f144bc54bb0c512817"
    // index: 0
    // isFullyFunded: false
    // milestones: 2
    // owner: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
    // released: 0
    // releasedETH: 0
    // remainingToGoal: 2e-18
    // timestamp: 1755843183
    // title: "Project 0"
    // updatedAt: "2025-08-22T09:18:43.625Z"
  };

  // Safe number formatting with fallbacks
  const safeToFixed = (
    num: number | undefined,
    decimals: number = 2
  ): string => {
    return (num || 0).toFixed(decimals);
  };

  if (viewMode === "list") {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold truncate">
                  {project.title}
                </h3>
                <Badge variant={isFullyFunded ? "default" : "secondary"}>
                  {isFullyFunded ? "Funded" : "Active"}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {project.description}
              </p>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{truncateAddress(project.owner)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="h-4 w-4" />
                  <span>{safeToFixed(project.goalETH)} ETH</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>{safeToFixed(project.fundedETH)} ETH</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(project.timestamp)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 ml-6">
              <div className="text-right">
                <div className="text-sm font-medium">
                  {safeToFixed(fundingPercentage, 1)}% Funded
                </div>
                <Progress value={fundingPercentage} className="w-24 mt-1" />
              </div>

              <Button size="sm" onClick={handleViewProject}>
                View <ExternalLink className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">
            {project.title}
          </CardTitle>
          <Badge variant={isFullyFunded ? "default" : "secondary"}>
            {isFullyFunded ? "Funded" : "Active"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {project.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Goal</span>
            <span className="font-medium">
              {safeToFixed(project.goalETH)} ETH
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Funded</span>
            <span className="font-medium">
              {safeToFixed(project.fundedETH)} ETH
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {safeToFixed(fundingPercentage, 1)}%
              </span>
            </div>
            <Progress value={fundingPercentage} />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Milestones</span>
            <span className="font-medium">{project.milestones || 0}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Owner</span>
            <span className="font-medium">
              {truncateAddress(project.owner)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Created</span>
            <span className="font-medium">{formatDate(project.timestamp)}</span>
          </div>
        </div>

        <div className="pt-4">
          <Button className="w-full" onClick={handleViewProject}>
            View Project <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
