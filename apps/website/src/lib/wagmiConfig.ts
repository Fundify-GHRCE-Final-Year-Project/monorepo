import { toast } from "sonner";
import { http, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected, metaMask } from "wagmi/connectors";

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
if (!rpcUrl)
  toast.error("Enviorment Error", {
    description: "NEXT_PUBLIC_RPC_URL is not set",
  });

export const wagmiConfig = createConfig({
  chains: [mainnet],
  connectors: [injected(), metaMask()],
  transports: {
    [mainnet.id]: http(rpcUrl),
  },
});
