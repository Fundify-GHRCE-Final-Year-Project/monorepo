"use client";

import { Provider } from "jotai";
import { useEffect } from "react";
import { useAtom } from "jotai";
import {
  isUserConnectedAtom,
  userWalletAtom,
  currentUserAtom,
  errorMessageAtom,
  successMessageAtom,
} from "@/store/global";
import {
  getUserFromCache,
  getWalletFromCache,
  clearAllCache,
} from "@/lib/browserCache";
import { useAccount, WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmiConfig";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { TransactionDialogProvider } from "./ui/TransactionDialog";

function AppProviders({ children }: { children: React.ReactNode }) {
  const [error, setError] = useAtom(errorMessageAtom);
  const [success, setSuccess] = useAtom(successMessageAtom);

  // useEffect(() => {
  //   // Initialize wallet connection from cache
  //   const cachedWallet = getWalletFromCache();
  //   if (cachedWallet) {
  //     setWallet(cachedWallet);
  //     setIsConnected(true);
  //   } else {
  //     setIsConnected(true);
  //     setWallet("0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6");
  //   }

  //   // Initialize user data from cache
  //   const cachedUser = getUserFromCache();
  //   if (cachedUser) {
  //     setCurrentUser(cachedUser);
  //   }
  // }, []);

  useEffect(() => {
    // Auto-clear error messages after 5 seconds
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  useEffect(() => {
    // Auto-clear success messages after 3 seconds
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, setSuccess]);

  // Global error handler
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason);
      setError("An unexpected error occurred. Please try again.");
    };

    const handleError = (event: ErrorEvent) => {
      console.error("Global error:", event.error);
      setError("An unexpected error occurred. Please try again.");
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
      window.removeEventListener("error", handleError);
    };
  }, [setError]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        toast.error("Something went wrong!", {
          description: `More Details: ${error.message}`,
        });
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        toast.error("Something went wrong!", {
          description: `More Details: ${error.message}`,
        });
      },
    }),
  });

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <TransactionDialogProvider>
          <Provider>
            <AppProviders>{children}</AppProviders>
          </Provider>
        </TransactionDialogProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
