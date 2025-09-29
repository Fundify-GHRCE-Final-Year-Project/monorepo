// pages/project/[index]/investments.tsx or app/project/[index]/investments/page.tsx
"use client";

import { useGetProjectInvestments } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign,
  ArrowLeft,
  Calendar,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { currentUserAtom } from "@/store/global";

interface ProjectInvestmentsPageProps {
  params: {
    index: string;
  };
}

export default function ProjectInvestmentsPage({
  params,
}: ProjectInvestmentsPageProps) {
  const projectIndex = parseInt(params.index);
  const {
    project,
    investments,
    totalInvestments,
    totalAmount,
    isLoading,
    error,
  } = useGetProjectInvestments(String(projectIndex));
  const [currentUser] = useAtom(currentUserAtom);
  const router = useRouter();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const formatEth = (amount: string) => {
    try {
      const eth = parseFloat(amount);
      return eth.toFixed(4);
    } catch {
      return "0.0000";
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-2xl font-semibold">
            Error Loading Project Investments
          </h2>
          <p className="text-muted-foreground text-center max-w-md">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading project investments...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Project Investments</h1>
          {project && (
            <div>
              <h2 className="text-xl text-muted-foreground">
                {project.title || `Project #${project.index}`}
              </h2>
              <p className="text-sm text-muted-foreground">
                Owner: {formatAddress(project.owner)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Investment Summary */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Raised
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatEth(totalAmount)} ETH
              </div>
              <p className="text-xs text-muted-foreground">
                Goal: {project ? formatEth(project.goal) : "0"} ETH
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Investors
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInvestments}</div>
              <p className="text-xs text-muted-foreground">
                Unique investments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {project
                  ? Math.round(
                      (parseFloat(totalAmount) / parseFloat(project.goal)) * 100
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">Of funding goal</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Investments List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Investment History</h3>

        {investments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No investments yet</h3>
              <p className="text-muted-foreground text-center">
                This project hasn't received any investments yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {investments.map((investment: any) => (
              <Card key={`${investment.funder}-${investment.investmentIndex}`}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {formatAddress(investment.funder)}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(investment.timestamp)}</span>
                        <Badge variant="secondary">
                          Investment #{investment.investmentIndex}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      {formatEth(investment.amount)} ETH
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Investment Amount
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
