"use client";

import { Provider } from "jotai";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmiConfig";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { TransactionDialogProvider } from "./ui/TransactionDialog";

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
          <Provider>{children}</Provider>
        </TransactionDialogProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
