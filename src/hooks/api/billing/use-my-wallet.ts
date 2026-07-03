"use client";

import { useQuery } from "@tanstack/react-query";
import { walletApi } from "@/lib/api/billing/wallet.api";

export function useMyWallet() {
	return useQuery({ queryKey: ["wallet-me"], queryFn: walletApi.myWallet });
}
