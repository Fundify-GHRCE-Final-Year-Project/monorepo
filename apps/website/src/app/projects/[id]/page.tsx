"use client";

import { useParams } from "next/navigation";
import { useGetProject, fetchUserByWallet } from "@/lib/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  AlertCircle,
  Calendar,
  Target,
  User,
  Users,
  Wallet,
  TrendingUp,
  DollarSign,
  CheckCircle,
  ExternalLink,
  PieChart,
  Clock,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { useRouter } from "next/navigation";
import { currentUserAtom } from "@/store/global";
import { useAtom } from "jotai";
import { useDialog } from "@/components/ui/TransactionDialog";
import { toast } from "sonner";
import { abi } from "@fundify/contract";
import { parseEther } from "viem";

interface User {
  _id: string;
  wallet: string;
  name?: string;
  country?: string;
  role?: string;
  phone?: string;
  address?: string;
  linkedin?: string;
  x?: string;
  github?: string;
  skills?: string[];
  interests?: string[];
  createdAt: string;
  updatedAt: string;
}

interface Investment {
  _id: string;
  funder: string;
  investmentIndex: number;
  projectOwner: string;
  projectIndex: number;
  amount: number;
  timestamp: number;
  funderDetails: User | null;
}

interface InvestmentsByFunder {
  funder: string;
  funderDetails: User | null;
  totalAmount: number;
  investmentCount: number;
  investments: Investment[];
}

interface InvestmentsData {
  project: {
    id: string;
    title: string;
    owner: string;
    index: number;
    goal: number;
    funded: number;
  };
  summary: {
    totalInvestors: number;
    totalAmount: number;
    totalInvestments: number;
    averageInvestment: number;
  };
  investments: Investment[];
  investmentsByFunder: InvestmentsByFunder[];
}

export default function ViewProject() {
  const params = useParams();
  const { address: walletAddress } = useAccount();
  const projectId = typeof params?.id === "string" ? params.id : null;
  const router = useRouter();

  const [currentUser] = useAtom(currentUserAtom);
  const { showLoadingDialog, hideLoadingDialog } = useDialog();
  const { writeContractAsync } = useWriteContract();

  const [releaseAddress, setReleaseAddress] = useState("");
  const [releaseAmount, setReleaseAmount] = useState("");
  const [isReleasing, setIsReleasing] = useState(false);

  const {
    project,
    isLoading: projectLoading,
    error: projectError,
  } = useGetProject(projectId);

  const [owner, setOwner] = useState<User | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [ownerLoading, setOwnerLoading] = useState(false);
  const [membersLoading, setMembersLoading] = useState(false);
  const [investAmount, setInvestAmount] = useState("");
  const [isInvesting, setIsInvesting] = useState(false);

  // New state for investments
  const [investmentsData, setInvestmentsData] =
    useState<InvestmentsData | null>(null);
  const [investmentsLoading, setInvestmentsLoading] = useState(false);
  const [investmentsError, setInvestmentsError] = useState<string | null>(null);

  // Calculate project statistics
  const projectStats = useMemo(() => {
    if (!project) return null;

    const goalETH = project.goal ? project.goal : 0;
    const fundedETH = project.funded ? project.funded : 0;
    const releasedETH = project.released ? project.released : 0;
    const fundingPercentage = goalETH > 0 ? (fundedETH / goalETH) * 100 : 0;
    const isFullyFunded = fundingPercentage >= 100;

    const daysAgo = project.timestamp
      ? Math.floor(
          (Date.now() / 1000 - Number(project.timestamp)) / (24 * 60 * 60)
        )
      : 0;

    return {
      goalETH,
      fundedETH,
      releasedETH,
      fundingPercentage: Math.min(fundingPercentage, 100),
      isFullyFunded,
      remainingETH: Math.max(goalETH - fundedETH, 0),
      daysAgo,
    };
  }, [project]);

  // Check if current user is the owner
  const isOwner = useMemo(() => {
    return walletAddress && project?.owner
      ? walletAddress.toLowerCase() === project.owner.toLowerCase()
      : false;
  }, [walletAddress, project?.owner]);

  // Fetch investments data if user is the owner
  useEffect(() => {
    if (!projectId || !isOwner) return;

    const fetchInvestments = async () => {
      setInvestmentsLoading(true);
      setInvestmentsError(null);
      try {
        const response = await fetch(`/api/project/${projectId}/investments`);
        const result = await response.json();

        if (result.ok) {
          setInvestmentsData(result.data);
        } else {
          setInvestmentsError(result.error || "Failed to fetch investments");
        }
      } catch (err) {
        console.error("Failed to fetch investments:", err);
        setInvestmentsError("Failed to fetch investments");
      } finally {
        setInvestmentsLoading(false);
      }
    };

    fetchInvestments();
  }, [projectId, isOwner]);

  // Fetch owner info when project is loaded
  useEffect(() => {
    if (!project?.owner) return;

    const fetchOwner = async () => {
      setOwnerLoading(true);
      try {
        const data = await fetchUserByWallet(project.owner);
        if (data && data.wallet) {
          setOwner(data);
        }
      } catch (err) {
        console.error("Failed to fetch owner info", err);
      } finally {
        setOwnerLoading(false);
      }
    };

    fetchOwner();
  }, [project?.owner]);

  // Fetch members info when project is loaded
  useEffect(() => {
    if (!project?.members || project.members.length === 0) return;

    const fetchMembers = async () => {
      setMembersLoading(true);
      console.log(project);
      try {
        const memberPromises = project.members.map((memberWallet: string) =>
          fetchUserByWallet(memberWallet).catch((err) => {
            console.error(`Failed to fetch member ${memberWallet}:`, err);
            return null;
          })
        );

        const memberResults = await Promise.all(memberPromises);
        const validMembers = memberResults.filter(
          (member): member is User => member !== null && member.wallet
        );
        console.log(validMembers);
        setMembers(validMembers);
      } catch (err) {
        console.error("Failed to fetch members info", err);
      } finally {
        setMembersLoading(false);
      }
    };

    fetchMembers();
  }, [project?.members]);

  // Handle Release
  const handleRelease = async () => {
    if (!currentUser) {
      toast.error("No Wallet Found", {
        description: "Please connect your wallet",
      });
      return;
    }

    if (!releaseAddress || !releaseAmount || !project) {
      toast.error("Invalid Inputs", {
        description: "Please enter valid address and amount",
      });
      return;
    }

    showLoadingDialog({
      isOpen: true,
      title: "Processing Release",
      description: "Releasing funds on Ethereum",
    });

    try {
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      if (!contractAddress) {
        toast.error("Environment Error", {
          description: "CONTRACT_ADDRESS is not set.",
        });
        return;
      }

      const sig = await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: abi,
        functionName: "releaseFunds",
        args: [project.index, releaseAddress, parseEther(releaseAmount)],
        gas: BigInt(300000),
      });

      toast.success("Funds Released", {
        description: `Transaction: ${sig}`,
      });

      setReleaseAddress("");
      setReleaseAmount("");
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Release Failed", {
        description: `${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    } finally {
      hideLoadingDialog();
    }
  };

  // Handle investment
  const handleInvest = async () => {
    if (!currentUser) {
      toast.error("No Wallet Found", {
        description: "Please install a wallet extension to use Fundify",
      });
      return;
    }

    if (!investAmount || !project || !walletAddress) {
      toast.error("Invalid Inputs", {
        description: "Please enter valid inputs",
      });
      return;
    }

    showLoadingDialog({
      isOpen: true,
      title: "Processing your request",
      description: "Calling Fundify on Ethereum",
    });
    try {
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      if (!contractAddress) {
        toast.error("Environment Error", {
          description: "CONTRACT_ADDRESS is not set.",
        });
        return;
      }
      const sig = await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: abi,
        functionName: "fundProject",
        args: [project.owner, project.index],
        gas: BigInt(300000),
        value: parseEther(investAmount),
      });
      toast.success("Investment Successful", {
        description: `${sig}`,
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error("Error", {
        description: `${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    } finally {
      hideLoadingDialog();
    }
  };

  // Format timestamp to readable date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInvestorData = async (address: string) => {
    const userData = await fetchUserByWallet(address);
    return userData;
  };

  const [investorDetails, setInvestorDetails] = useState<{
    [address: string]: any;
  }>({});

  const fetchInvestorData = async (funder: string) => {
    try {
      console.log("Fetching data for funder:", funder);
      const data = await fetchUserByWallet(funder);
      console.log("funder data",data);
      setInvestorDetails((prev) => ({ ...prev, [funder]: data }));
    } catch (err) {
      console.error("Error fetching investor data:", err);
    }
  };

  useEffect(() => {
    if (investmentsData && investmentsData.investmentsByFunder) {
      investmentsData.investmentsByFunder.forEach((inv) => {
        if (!investorDetails[inv.funder]) {
          fetchInvestorData(inv.funder);
        }
      });
    }
    console.log(investmentsData);
  }, [investmentsData]);

  // Early return: invalid projectId
  if (!projectId) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-2xl font-semibold">Invalid Project ID</h2>
        <p className="text-muted-foreground">
          The project ID provided is not valid.
        </p>
      </div>
    );
  }

  // Loading state
  if (projectLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading project details...</span>
      </div>
    );
  }

  // Error state
  if (projectError) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-2xl font-semibold">Error Loading Project</h2>
        <p className="text-muted-foreground">
          {typeof projectError === "string"
            ? projectError
            : "An error occurred while fetching project data."}
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-orange-500" />
        <h2 className="text-2xl font-semibold">Project Not Found</h2>
        <p className="text-muted-foreground">
          The project with ID {projectId} could not be found.
        </p>
      </div>
    );
  }

  if (!walletAddress) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl">
                Wallet Connection Required
              </CardTitle>
              <CardDescription>Please connect your wallet.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => router.push("/")}>Connect Wallet</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Project Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {project.title || `Project #${project.index}`}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Created {projectStats?.daysAgo} days ago
              </div>
              <div className="flex items-center">
                <Target className="h-4 w-4 mr-1" />
                Project #{project.index}
              </div>
            </div>
          </div>
          <Badge
            variant={projectStats?.isFullyFunded ? "default" : "secondary"}
            className="text-sm px-3 py-1"
          >
            {projectStats?.isFullyFunded ? "Fully Funded" : "Active"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Project Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Description */}
          <Card>
            <CardHeader>
              <CardTitle>About This Project</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {project.description || "No description available."}
              </p>
            </CardContent>
          </Card>

          {/* Project Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Project Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {projectStats?.goalETH.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Goal (ETH)
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {projectStats?.fundedETH.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Funded (ETH)
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {projectStats?.releasedETH.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Released (ETH)
                  </div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {project.milestones}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Milestones
                  </div>
                </div>
              </div>

              {/* Funding Progress */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Funding Progress</span>
                  <span className="font-bold text-green-600">
                    {projectStats?.fundingPercentage.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={projectStats?.fundingPercentage}
                  className="h-3"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{projectStats?.fundedETH.toFixed(2)} ETH raised</span>
                  <span>
                    {projectStats?.remainingETH.toFixed(2)} ETH remaining
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investors Section - Only visible to owner */}
          {isOwner && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Project Investors
                  {investmentsLoading && (
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  )}
                </CardTitle>
                <CardDescription>
                  View all investors who have funded your project
                </CardDescription>
              </CardHeader>
              <CardContent>
                {investmentsLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading investments...</span>
                  </div>
                ) : investmentsError ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
                    <p>{investmentsError}</p>
                  </div>
                ) : investmentsData &&
                  investmentsData.summary.totalInvestors > 0 ? (
                  <div className="space-y-6">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-indigo-50 rounded-lg">
                        <div className="text-2xl font-bold text-indigo-600">
                          {investmentsData.summary.totalInvestors}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Investors
                        </div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {investmentsData.summary.totalAmount.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total ETH
                        </div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {investmentsData.summary.totalInvestments}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Investments
                        </div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {investmentsData.summary.averageInvestment.toFixed(3)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Avg ETH
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Investors List */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Top Investors</h4>
                      {investmentsData.investmentsByFunder.map(
                        (investorData, index) => (
                          <div
                            key={investorData.funder}
                            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                  {/* Avatar or initials here */}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2">
                                    <h5 className="font-medium">
                                      {investorDetails[investorData.funder]
                                        ?.name || "Anonymous Investor"}
                                    </h5>
                                    {index === 0 && (
                                      <Badge
                                        variant="default"
                                        className="text-xs"
                                      >
                                        Top Investor
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs font-mono text-muted-foreground truncate mt-1">
                                    {investorData.funder}
                                  </p>
                                  {investorData.funderDetails?.role && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {investorData.funderDetails.role}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <div className="text-lg font-bold text-green-600">
                                  {investorData.totalAmount.toFixed(3)} ETH
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {investorData.investmentCount} investment
                                  {investorData.investmentCount > 1 ? "s" : ""}
                                </div>
                              </div>
                            </div>

                            {/* Individual Investments */}
                            {investorData.investmentCount > 1 && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <div className="text-xs text-muted-foreground mb-2">
                                  Investment History:
                                </div>
                                <div className="space-y-1">
                                  {investorData.investments.map(
                                    (inv: Investment) => (
                                      <div
                                        key={inv._id}
                                        className="flex justify-between items-center text-xs"
                                      >
                                        <div className="flex items-center space-x-2">
                                          <Clock className="h-3 w-3" />
                                          <span>
                                            {formatDate(inv.timestamp)}
                                          </span>
                                        </div>
                                        <span className="font-medium">
                                          {inv.amount.toFixed(3)} ETH
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No investments yet</p>
                    <p className="text-sm mt-1">
                      Investors will appear here once they fund your project
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Owner Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Project Owner
                {ownerLoading && (
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {owner ? (
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {owner.name ? owner.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">
                        {owner.name || "Anonymous User"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {owner.role || "Role not specified"}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground mt-1">
                        {owner.wallet}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Country:</span>
                      <p className="font-medium">
                        {owner.country || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>
                      <p className="font-medium">
                        {owner.phone || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {owner.skills && owner.skills.length > 0 && (
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Skills:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {owner.skills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {owner.interests && owner.interests.length > 0 && (
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Interests:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {owner.interests.map((interest, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Social Links */}
                  <div className="flex space-x-2">
                    {owner.linkedin && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={owner.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {owner.github && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={owner.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          GitHub
                        </a>
                      </Button>
                    )}
                    {owner.x && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={owner.x}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />X
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  <div className="font-mono text-xs mb-2">{project.owner}</div>
                  <p>Owner information not available in database.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Members Info */}
          {project.members && project.members.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Project Members ({project.members.length})
                  {membersLoading && (
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {members.length > 0 ? (
                  <div className="space-y-4">
                    {members.map((member) => (
                      <div
                        key={member.wallet}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {member.name
                            ? member.name.charAt(0).toUpperCase()
                            : "M"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium truncate">
                            {member.name || "Anonymous Member"}
                          </h5>
                          <p className="text-xs text-muted-foreground truncate">
                            {member.role || "Member"}
                          </p>
                          <p className="text-xs font-mono text-muted-foreground truncate">
                            {member.wallet}
                          </p>
                        </div>
                        {member.skills && member.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {member.skills.slice(0, 3).map((skill, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                            {member.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{member.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Member information not available in database.
                    </p>
                    <div className="space-y-1">
                      {project.members.map(
                        (memberWallet: string, index: number) => (
                          <div
                            key={index}
                            className="text-xs font-mono text-muted-foreground p-2 bg-gray-100 rounded"
                          >
                            {memberWallet}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Investment/Release Panel */}
        {walletAddress && isOwner ? (
          // OWNER VIEW - Release Funds Section
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="h-5 w-5 mr-2" />
                  Release Funds
                </CardTitle>
                <CardDescription>
                  Release funds to project members
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {projectStats?.fundedETH.toFixed(2)}
                  </div>
                  <p className="text-sm text-muted-foreground">Available ETH</p>
                  <div className="text-lg font-semibold text-green-600 mt-1">
                    {projectStats?.releasedETH.toFixed(2)} ETH released
                  </div>
                </div>

                <Separator />

                {/* Release Address Input */}
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Release to Address
                  </label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={releaseAddress}
                    onChange={(e) => setReleaseAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Release Amount Input */}
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Release Amount (ETH)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder="0.1"
                    value={releaseAmount}
                    onChange={(e) => setReleaseAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Release Button */}
                <Button
                  onClick={handleRelease}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  disabled={!releaseAddress || !releaseAmount || isReleasing}
                >
                  {isReleasing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Releasing...
                    </>
                  ) : (
                    <>Release {releaseAmount || "0"} ETH</>
                  )}
                </Button>

                <Separator />

                <div className="text-xs text-muted-foreground space-y-2">
                  <p>
                    • Release funds to team members for milestone completion
                  </p>
                  <p>• Ensure the address is correct before releasing</p>
                  <p>• Releases are recorded on the blockchain</p>
                  <p>• Released funds cannot be returned</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          walletAddress && (
            // INVESTOR VIEW - Investment Section
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wallet className="h-5 w-5 mr-2" />
                    Invest in This Project
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                      {projectStats?.fundingPercentage.toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground">funded</p>
                    <div className="text-lg font-semibold text-blue-600 mt-1">
                      {projectStats?.fundedETH.toFixed(2)} /{" "}
                      {projectStats?.goalETH.toFixed(2)} ETH
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-2">
                        Investment Amount (ETH)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.001"
                          min="0"
                          placeholder="0.1"
                          value={investAmount}
                          onChange={(e) => setInvestAmount(e.target.value)}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={projectStats?.isFullyFunded || isInvesting}
                        />
                        <div className="absolute right-3 top-3 text-sm text-muted-foreground">
                          ETH
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleInvest}
                      className="w-full py-3 text-lg font-semibold"
                      size="lg"
                      disabled={
                        !investAmount ||
                        parseFloat(investAmount) <= 0 ||
                        projectStats?.isFullyFunded ||
                        isInvesting
                      }
                    >
                      {isInvesting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Investing...
                        </>
                      ) : projectStats?.isFullyFunded ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Project Fully Funded
                        </>
                      ) : (
                        <>
                          <DollarSign className="h-4 w-4 mr-2" />
                          Invest {investAmount || "0"} ETH
                        </>
                      )}
                    </Button>

                    {investAmount && parseFloat(investAmount) > 0 && (
                      <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg">
                        <p className="font-medium">Investment Summary:</p>
                        <p>Amount: {investAmount} ETH</p>
                        <p>
                          Your contribution:{" "}
                          {projectStats && projectStats.goalETH > 0
                            ? (
                                (parseFloat(investAmount) /
                                  projectStats.goalETH) *
                                100
                              ).toFixed(2)
                            : 0}
                          % of goal
                        </p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="text-xs text-muted-foreground space-y-2">
                    <p>• Your investment will be held in a smart contract</p>
                    <p>• Funds are released based on milestone completion</p>
                    <p>• You can track project progress and fund releases</p>
                    <p>• Investment is non-refundable once committed</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        )}
      </div>
    </div>
  );
}
