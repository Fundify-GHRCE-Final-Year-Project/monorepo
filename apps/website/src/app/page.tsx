"use client";
import Link from "next/link";
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
  Rocket,
  Shield,
  Users,
  Zap,
  TrendingUp,
  Globe,
  ArrowRight,
  Star,
  CheckCircle,
} from "lucide-react";
import { useEffect } from "react";
import { currentUserAtom, isUserConnectedAtom } from "@/store/global";
import { useSetAtom } from "jotai";

export default function HomePage() {
  const setUser = useSetAtom(currentUserAtom);
  const setIsConnected = useSetAtom(isUserConnectedAtom);
  // useEffect(() => {
  //   const user = generateDummyUser("0x");
  //   setUser(user);
  //   setIsConnected(true);
  // }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center space-y-8">
            <Badge variant="outline" className="mb-4">
              <Rocket className="h-3 w-3 mr-1" />
              Decentralized Funding Platform
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Fund Your Dreams with{" "}
              <span className="gradient-text">Cryptocurrency</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect with global investors and bring your innovative projects
              to life. Fundify makes it easy to raise funds, manage milestones,
              and build the future.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/projects">
                <Button size="lg" className="text-lg px-8 py-6">
                  Browse Projects
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/publish">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6"
                >
                  Start Your Project
                  <Rocket className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="flex justify-center items-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No Platform Fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span>Secure Smart Contracts</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-purple-500" />
                <span>Global Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Fundify?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform combines the power of blockchain technology with
              user-friendly features to create the ultimate funding experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Secure & Transparent</CardTitle>
                <CardDescription>
                  All transactions are secured by smart contracts on the
                  Ethereum blockchain, ensuring complete transparency and trust.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Instant Funding</CardTitle>
                <CardDescription>
                  Receive funds instantly in cryptocurrency. No waiting periods,
                  no complex banking procedures.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Global Community</CardTitle>
                <CardDescription>
                  Connect with investors from around the world. Build a global
                  network of supporters for your project.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle>Milestone Tracking</CardTitle>
                <CardDescription>
                  Set and track project milestones. Funds are released
                  automatically as you achieve your goals.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                  <Rocket className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle>Easy Setup</CardTitle>
                <CardDescription>
                  Create and launch your project in minutes. Our intuitive
                  interface makes fundraising simple.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle>Decentralized</CardTitle>
                <CardDescription>
                  No central authority controls your funds. You maintain full
                  control over your project and finances.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold gradient-text">
                $2.5M+
              </div>
              <div className="text-muted-foreground">Total Funds Raised</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold gradient-text">
                150+
              </div>
              <div className="text-muted-foreground">Projects Funded</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold gradient-text">
                5K+
              </div>
              <div className="text-muted-foreground">Active Investors</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold gradient-text">
                98%
              </div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators and investors who are already building
            the future with Fundify.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/publish">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6"
              >
                Launch Your Project
                <Rocket className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/projects">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600"
              >
                Explore Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
