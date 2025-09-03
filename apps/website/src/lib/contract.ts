import { abi, contractAddress } from "@fundify/contract";

export const wagmiContractConfig = {
  address: contractAddress,
  abi: abi,
} as const;
