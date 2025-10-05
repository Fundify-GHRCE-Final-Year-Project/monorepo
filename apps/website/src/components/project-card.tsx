"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Target, TrendingUp, User, ExternalLink } from "lucide-react";
import { IProject } from "@fundify/database";
import Link from "next/link";
import { styleText } from "util";

interface ProjectCardProps {
  id: string;
  project: IProject;
  viewMode?: "grid" | "list";
}

export function ProjectCard({ id, project, viewMode = "grid" }: ProjectCardProps) {
  // Safely calculate funding percentage
  const calculateFundingPercentage = () => {
    if (!project.goal || project.goal === 0) return 0;
    const funded = project.funded || 0;
    const goal = project.goal;
    return Math.min((funded / goal) * 100, 100);
  };

  const fundingPercentage = calculateFundingPercentage();
  const isFullyFunded = fundingPercentage >= 100;

  // Format UNIX timestamp safely
  const formatDate = (timestamp: number | string | bigint) => {
    let time: number;
    if (typeof timestamp === "string") {
      time = parseInt(timestamp);
    } else if (typeof timestamp === "bigint") {
      time = Number(timestamp);
    } else {
      time = timestamp;
    }
    return new Date(time * 1000).toLocaleDateString();
  };

  // Truncate Ethereum addresses
  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Safe number formatting
  // const safeToFixed = (num: number | undefined, decimals: number = 2): string => {
  //   return (num || 0).toFixed(decimals);
  // };

  const handleViewProject = () => {

    console.log("View project:", project);
  };

  // List view design
  if (viewMode === "list") {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold truncate">{project.title}</h3>
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
                  <span>{(project.goal)} ETH</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>{(project.funded)} ETH</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(project.timestamp)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 ml-6">
              <div className="text-right">
                <div className="text-sm font-medium">{(fundingPercentage).toFixed(1)}% Funded</div>
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

  function stripHtml(html: string) {
  let doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

  // Grid / card view design
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
          <div className="flex items-center space-x-2">
            {project.category && <Badge variant="default">{project.category}</Badge>}
            <Badge variant={isFullyFunded ? "default" : "secondary"}>
              {isFullyFunded ? "Funded" : "Active"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3 prose max-w-none"   />
        {(stripHtml(project.description.slice(0, 300) || ""))}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Goal</span>
            <span className="font-medium">{(project.goal)} ETH</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Funded</span>
            <span className="font-medium">{(project.funded)} ETH</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{(fundingPercentage).toFixed(1)}%</span>
            </div>
            <Progress value={fundingPercentage} />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Milestones</span>
            <span className="font-medium">{project.milestones || 0}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Owner</span>
            <span className="font-medium">{truncateAddress(project.owner)}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Created</span>
            <span className="font-medium">{formatDate(project.timestamp)}</span>
          </div>
        </div>

        <div className="pt-4">
         <Button className="w-full" onClick={handleViewProject} asChild>
              <Link href={`/projects/${id}`}>
                View Project   <span><ExternalLink className="ml-2 h-4 w-4" /></span> 
              </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
