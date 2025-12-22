"use client";

import { useState, useCallback } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { base } from "wagmi/chains";
import {
  APOSTLES_CONTRACT_ADDRESS,
  APOSTLES_ABI,
  NATIVE_TOKEN_ADDRESS,
  type AllowlistProof,
} from "~/lib/contract";
import { useApostlesContract } from "./useApostlesContract";

interface ProofResponse {
  isAllowlisted: boolean;
  proof: string[];
  quantityLimitPerWallet: string;
  pricePerToken: string;
  currency: string;
}

interface UseMintResult {
  mint: (quantity: number) => void;
  isLoading: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  txHash: `0x${string}` | undefined;
  reset: () => void;
  isAllowlisted: boolean | null;
  checkingAllowlist: boolean;
}

/**
 * Hook for minting Apostles NFTs
 * Fetches merkle proof from API and uses it for allowlist mints
 */
export function useMint(walletAddress: string | undefined): UseMintResult {
  // Get price and supply info from contract
  const { priceWei, claimCondition, remaining } = useApostlesContract();
  const pricePerToken = priceWei ?? 0n;

  // Get user's current NFT balance for max-per-wallet check
  const { data: userBalance } = useReadContract({
    address: APOSTLES_CONTRACT_ADDRESS,
    abi: APOSTLES_ABI,
    functionName: "balanceOf",
    args: walletAddress ? [walletAddress as `0x${string}`] : undefined,
    chainId: base.id,
    query: {
      enabled: !!walletAddress,
    },
  });

  // Allowlist state
  const [isAllowlisted, setIsAllowlisted] = useState<boolean | null>(null);
  const [checkingAllowlist, setCheckingAllowlist] = useState(false);
  const [cachedProof, setCachedProof] = useState<AllowlistProof | null>(null);
  const [mintError, setMintError] = useState<Error | null>(null);

  // Write contract hook
  const {
    writeContract,
    data: txHash,
    isPending: isWritePending,
    isError: isWriteError,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  // Wait for transaction confirmation
  const {
    isLoading: isConfirming,
    isSuccess,
    isError: isConfirmError,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Fetch proof from API
  const fetchProof = useCallback(async (address: string): Promise<AllowlistProof | null> => {
    try {
      setCheckingAllowlist(true);
      setMintError(null);

      const response = await fetch(`/api/proof?address=${address}`);
      const data = await response.json();

      if (!response.ok || !data.isAllowlisted) {
        setIsAllowlisted(false);
        return null;
      }

      setIsAllowlisted(true);

      const proof: AllowlistProof = {
        proof: data.proof as `0x${string}`[],
        quantityLimitPerWallet: BigInt(data.quantityLimitPerWallet || "0"),
        pricePerToken: BigInt(data.pricePerToken || "0"),
        currency: (data.currency || NATIVE_TOKEN_ADDRESS) as `0x${string}`,
      };

      setCachedProof(proof);
      return proof;
    } catch (error) {
      console.error("Error fetching proof:", error);
      setIsAllowlisted(false);
      return null;
    } finally {
      setCheckingAllowlist(false);
    }
  }, []);

  const mint = useCallback(async (quantity: number) => {
    if (!walletAddress) {
      console.error("No wallet address");
      setMintError(new Error("Please connect your wallet to mint"));
      return;
    }

    setMintError(null);

    // Check if sold out
    if (remaining !== undefined && remaining <= 0) {
      setMintError(new Error("Sorry, this collection is sold out!"));
      return;
    }

    // Check if enough supply for requested quantity
    if (remaining !== undefined && quantity > remaining) {
      setMintError(new Error(`Only ${remaining} NFT${remaining > 1 ? "s" : ""} remaining`));
      return;
    }

    // Check if claim has started (claimCondition has startTimestamp)
    if (claimCondition) {
      const now = BigInt(Math.floor(Date.now() / 1000));
      if (claimCondition.startTimestamp > now) {
        const startDate = new Date(Number(claimCondition.startTimestamp) * 1000);
        setMintError(new Error(`Minting starts ${startDate.toLocaleString()}`));
        return;
      }
    }

    // Fetch proof if we don't have it cached
    let proof = cachedProof;
    if (!proof) {
      proof = await fetchProof(walletAddress);
    }

    if (!proof) {
      const error = new Error("Your wallet is not on the allowlist for this phase");
      setMintError(error);
      console.error("Not on allowlist:", walletAddress);
      return;
    }

    // Check if user has already minted their max allocation
    const currentBalance = userBalance !== undefined ? BigInt(userBalance as bigint) : 0n;
    const maxAllowed = proof.quantityLimitPerWallet;

    if (maxAllowed > 0n && currentBalance >= maxAllowed) {
      const error = new Error(
        `You've already minted your maximum allocation (${maxAllowed.toString()} NFT${maxAllowed > 1n ? "s" : ""})`
      );
      setMintError(error);
      console.error("Max per wallet exceeded:", {
        currentBalance: currentBalance.toString(),
        maxAllowed: maxAllowed.toString(),
      });
      return;
    }

    // Check if requested quantity would exceed max
    if (maxAllowed > 0n && currentBalance + BigInt(quantity) > maxAllowed) {
      const remaining = maxAllowed - currentBalance;
      const error = new Error(
        `You can only mint ${remaining.toString()} more NFT${remaining > 1n ? "s" : ""}`
      );
      setMintError(error);
      return;
    }

    // Use price from proof if available, otherwise from claim condition
    const mintPrice = proof.pricePerToken > 0n ? proof.pricePerToken : pricePerToken;
    const totalValue = mintPrice * BigInt(quantity);

    console.log("Minting with proof:", {
      quantity,
      pricePerToken: mintPrice.toString(),
      totalValue: totalValue.toString(),
      receiver: walletAddress,
      proofLength: proof.proof.length,
      currentBalance: currentBalance.toString(),
      maxAllowed: maxAllowed.toString(),
    });

    writeContract({
      address: APOSTLES_CONTRACT_ADDRESS,
      abi: APOSTLES_ABI,
      functionName: "claim",
      args: [
        walletAddress as `0x${string}`, // _receiver
        BigInt(quantity),               // _quantity
        proof.currency,                 // _currency
        mintPrice,                      // _pricePerToken
        proof,                          // _allowlistProof
        "0x",                           // _data
      ],
      value: totalValue,
      chainId: base.id,
    });
  }, [walletAddress, cachedProof, fetchProof, pricePerToken, writeContract, userBalance, remaining, claimCondition]);

  const reset = useCallback(() => {
    resetWrite();
    setMintError(null);
  }, [resetWrite]);

  return {
    mint,
    isLoading: isWritePending || checkingAllowlist,
    isConfirming,
    isSuccess,
    isError: isWriteError || isConfirmError || mintError !== null,
    error: writeError || confirmError || mintError,
    txHash,
    reset,
    isAllowlisted,
    checkingAllowlist,
  };
}

/**
 * Hook to get mint price from contract
 */
export function useMintPrice() {
  const { priceWei, priceEth, isLoading } = useApostlesContract();
  
  return {
    priceWei: priceWei ?? 0n,
    priceEth: priceEth ?? 0,
    isLoading,
  };
}
