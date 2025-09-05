"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl">Something went wrong!</CardTitle>
            <CardDescription>
              An unexpected error occurred. Please try again or contact support
              if the problem persists.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              <strong>Error:</strong>{" "}
              {error.message || "Unknown error occurred"}
              {error.digest && (
                <div className="mt-1">
                  <strong>Error ID:</strong> {error.digest}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={reset} className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </Link>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                If this problem continues, please{" "}
                <Link href="/support" className="text-primary hover:underline">
                  contact support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
