// src/app/profile/page.tsx
"use client";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { currentUserAtom } from "@/store/global";
import { fetchUserByWallet, useGetUserProjects } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Wallet,
  MapPin,
  Briefcase,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Calendar,
  TrendingUp,
  FolderOpen,
  DollarSign,
  Edit,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAccount } from "wagmi";

interface UserData {
  _id: string;
  wallet: string;
  name: string;
  phone: string;
  address: string;
  country: string;
  role: string;
  skills: string[];
  github: string;
  linkedin: string;
  x: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [currentUser] = useAtom(currentUserAtom);
  const { projects, isLoading, error } = useGetUserProjects();

  // State for dynamically fetched user data
  const [fetchedUser, setFetchedUser] = useState<UserData | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  const { address: walletAddress, isConnected } = useAccount();

  // Fetch user data dynamically
  useEffect(() => {
    const fetchUser = async () => {
      if (!walletAddress) return;

      setIsUserLoading(true);
      setUserError(null);

      try {
        const userData = await fetchUserByWallet(walletAddress);
        console.log("Fetched user data:", userData);
        setFetchedUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUserError("Failed to fetch user data");
      } finally {
        setIsUserLoading(false);
      }
    };

    fetchUser();
  }, [walletAddress]);

  // Use fetched user data, fallback to currentUser from atom
  const displayUser = fetchedUser || currentUser;

  // Debug logging
  useEffect(() => {
    console.log("Profile Debug:", {
      isConnected,
      currentUser,
      fetchedUser,
      displayUser,
      userWallet: displayUser?.wallet,
      walletAddress,
      projects,
      isLoading,
      error,
    });
  }, [
    isConnected,
    currentUser,
    fetchedUser,
    displayUser,
    walletAddress,
    projects,
    isLoading,
    error,
  ]);

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const calculateProjectStats = () => {
    if (!projects || projects.length === 0) {
      return {
        totalProjects: 0,
        totalFunded: 0,
        totalGoal: 0,
        fundingPercentage: 0,
      };
    }

    const totalFunded = projects.reduce((sum, project) => {
      try {
        return sum + parseFloat(project.funded);
      } catch {
        return sum;
      }
    }, 0);

    const totalGoal = projects.reduce((sum, project) => {
      try {
        return sum + parseFloat(project.goal);
      } catch {
        return sum;
      }
    }, 0);

    return {
      totalProjects: projects.length,
      totalFunded,
      totalGoal,
      fundingPercentage: totalGoal > 0 ? (totalFunded / totalGoal) * 100 : 0,
    };
  };

  const stats = calculateProjectStats();

  // Show loading state while fetching user data
  if (isUserLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
            <h2 className="text-xl font-semibold mb-2">Loading Profile</h2>
            <p className="text-muted-foreground">
              Fetching your profile information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if user fetch failed
  if (userError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-2">
              Error Loading Profile
            </h2>
            <p className="text-muted-foreground mb-4">{userError}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  // Show no user state if no user data available
  if (!displayUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No User Data</h2>
            <p className="text-muted-foreground">
              Please connect your wallet to view profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account and view your activity on Fundiy.
          </p>
        </div>
        <Button onClick={() => router.push("/profile/editProfile")}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-xl">
                {displayUser.name || "Anonymous User"}
              </CardTitle>
              <CardDescription>
                {formatAddress(displayUser.wallet)}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* {displayUser.address && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{displayUser.address}</span>
                </div>
              )} */}

              {displayUser.country && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{displayUser.country}</span>
                </div>
              )}

              {displayUser.role && (
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="secondary">{displayUser.role}</Badge>
                </div>
              )}

              {/* {displayUser.phone && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{displayUser.phone}</span>
                </div>
              )} */}

              {/* Skills */}
              {displayUser.skills && displayUser.skills.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {displayUser.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className="space-y-2">
                {displayUser.github && (
                  <a
                    href={displayUser.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-sm hover:text-primary transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    <span>GitHub</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}

                {displayUser.linkedin && (
                  <a
                    href={displayUser.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-sm hover:text-primary transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    <span>LinkedIn</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}

                {displayUser.x && (
                  <a
                    href={displayUser.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-sm hover:text-primary transition-colors"
                  >
                    <Twitter className="h-4 w-4" />
                    <span>X (Twitter)</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              {/* Member Since */}
              {/* {displayUser.createdAt && (
                <div className="flex items-center space-x-3 pt-4 border-t">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Member since</p>
                    <p className="text-sm">
                      {new Date(displayUser.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )} */}
            </CardContent>
          </Card>
        </div>

        {/* Activity and Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Debug Info Card - Remove this in production */}
          {/* <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-sm text-blue-800">Current User Data Source</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1 text-blue-700">
              <div>Data Source: {fetchedUser ? 'API (Dynamic)' : 'Atom (Static)'}</div>
              <div>Wallet Address: {walletAddress}</div>
              <div>User Name: {displayUser?.name || 'Not found'}</div>
              <div>User Role: {displayUser?.role || 'Not specified'}</div>
              <div>Skills Count: {displayUser?.skills?.length || 0}</div>
            </CardContent>
          </Card> */}

          {/* Project Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Projects
                </CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProjects}</div>
                <p className="text-xs text-muted-foreground">
                  Active projects created
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Funds Raised
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalFunded.toFixed(3)} ETH
                </div>
                <p className="text-xs text-muted-foreground">
                  Total funding received
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Success Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.fundingPercentage.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Average funding progress
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Your latest project activities</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading your projects...</span>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-8 text-red-500">
                  <AlertCircle className="h-6 w-6 mr-2" />
                  <span>Error loading projects: {error}</span>
                </div>
              ) : projects && projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project) => (
                    <div
                      key={`${project.owner}-${project.index}`}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">
                          {project.title || `Project #${project.index}`}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {project.description
                            ? project.description.slice(0, 60) + "..."
                            : "No description available"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {parseFloat(project.funded || "0").toFixed(3)} ETH
                        </p>
                        <p className="text-xs text-muted-foreground">
                          of {parseFloat(project.goal || "0").toFixed(3)} ETH
                        </p>
                      </div>
                    </div>
                  ))}

                  {projects.length > 3 && (
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => router.push("/my-projects")}
                    >
                      View All Projects ({projects.length})
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    You haven't created any projects yet.
                  </p>
                  <Button onClick={() => router.push("/publish")}>
                    Create Your First Project
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/publish")}
                  className="h-12"
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Create New Project
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push("/my-projects")}
                  className="h-12"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View My Projects
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push("/invested-projects")}
                  className="h-12"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  My Investments
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push("/projects")}
                  className="h-12"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Browse Projects
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
