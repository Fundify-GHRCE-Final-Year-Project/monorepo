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
import { Search, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl">Page Not Found</CardTitle>
            <CardDescription>
              Sorry, we couldn't find the page you're looking for. It might have
              been moved, deleted, or you entered the wrong URL.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Error 404 - The requested page could not be found
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Link href="/" className="flex-1">
                <Button className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Try visiting our{" "}
                <Link href="/projects" className="text-primary hover:underline">
                  projects page
                </Link>{" "}
                or{" "}
                <Link href="/support" className="text-primary hover:underline">
                  contact support
                </Link>{" "}
                if you need help.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
