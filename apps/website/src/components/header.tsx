"use client";

import Link from "next/link";
import { useAtom } from "jotai";
import { currentUserAtom, hasProjectsAtom } from "@/store/global";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  Menu,
  X,
  User,
  FolderOpen,
  TrendingUp,
  Plus,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  setWalletToCache,
  clearWalletCache,
  clearUserCache,
  setUserToCache,
} from "@/lib/browserCache";
import { injected, useAccount, useConnect, useDisconnect } from "wagmi";
import { useDialog } from "./ui/TransactionDialog";

export function Header() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [hasProjects] = useAtom(hasProjectsAtom);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { address: walletAddress, isConnected: isWalletConnected } =
    useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { showCustomAlertDialog } = useDialog();

  const handleNoWalletConnectAttempt = () => {
    showCustomAlertDialog({
      title: "No Ethereum Wallet Found",
      description: "Please install a wallet extension to connect.",
      onConfirm: () => {},
      onCancel: () => {},
    });
  };

  useEffect(() => {
    if (isWalletConnected) {
      setWalletToCache(walletAddress as string);

      (async () => {
        try {
          // Upsert minimal record on server - creates if not exists and returns user doc
          const res = await fetch("/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ wallet: walletAddress }),
          });

          if (res.ok) {
            const user = await res.json();
            setCurrentUser(user);
            setUserToCache(user);

            if (!user.name || user.name.trim() === "") {
              router.push("/editProfile");
            }
          } else {
            console.error("Upsert user failed", await res.text());
          }
        } catch (err) {
          console.error("Error upserting user:", err);
        }
      })();
    }
  }, [walletAddress, isWalletConnected]);

  // Generate and set user data for the connected wallet
  //   const mockUser = {
  //     wallet: walletAddress as string,
  //     name: "Arav Bhivgade",
  //     country: "India",
  //     role: "Software Engineer",
  //     skills: ["JavaScript", "React", "TypeScript", "Node.js", "Blockchain"],
  //     experiences: [],
  //     linkedin: "https://linkedin.com/in/johndoe",
  //     x: "https://x.com/johndoe",
  //     github: "https://github.com/johndoe",
  //   };

  //   setCurrentUser(mockUser);
  //   setUserToCache(mockUser);
  // }

  const disconnectWallet = () => {
    disconnect();
    setCurrentUser(null);
    clearWalletCache();
    clearUserCache();
    setIsMobileMenuOpen(false);
  };

  const formatWalletAddress = (address: string | null) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold gradient-text">Fundify</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/projects"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Projects
            </Link>

            {isWalletConnected && (
              <Link
                href="/invested-projects"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Invested Projects
              </Link>
            )}

            {hasProjects && (
              <Link
                href="/my-projects"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                My Projects
              </Link>
            )}

            <Link
              href="/publish"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Publish Project
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isWalletConnected && walletAddress ? (
              <div className="flex items-center space-x-4">
                <Badge
                  variant="outline"
                  className="flex items-center space-x-1"
                >
                  <Wallet className="h-3 w-3" />
                  <span>{formatWalletAddress(walletAddress!)}</span>
                </Badge>

                <Link href={`/profile/${walletAddress}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={disconnectWallet}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Disconnect</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  if (window != undefined && window.ethereum == undefined) {
                    handleNoWalletConnectAttempt();
                  } else {
                    connect({ connector: injected() });
                  }
                }}
                className="flex items-center space-x-2"
              >
                <Wallet className="h-4 w-4" />
                <span>Connect Wallet</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/projects"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <FolderOpen className="h-4 w-4" />
                  <span>Projects</span>
                </div>
              </Link>

              {isWalletConnected && (
                <Link
                  href="/invested-projects"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Invested Projects</span>
                  </div>
                </Link>
              )}

              {hasProjects && (
                <Link
                  href="/my-projects"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>My Projects</span>
                  </div>
                </Link>
              )}

              <Link
                href="/publish"
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Publish Project</span>
                </div>
              </Link>

              {isWalletConnected && walletAddress ? (
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Wallet className="h-4 w-4" />
                    <span>{formatWalletAddress(walletAddress!)}</span>
                  </div>

                  <Link href="/profile">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={disconnectWallet}
                    className="w-full justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    if (window != undefined && window.ethereum == undefined) {
                      handleNoWalletConnectAttempt();
                    } else {
                      connect({ connector: injected() });
                    }
                  }}
                  className="w-full justify-start"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
