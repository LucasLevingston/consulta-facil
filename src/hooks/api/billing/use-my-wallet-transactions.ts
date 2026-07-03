"use client";

import { useQuery } from "@tanstack/react-query";
import { walletApi } from "@/lib/api/billing/wallet.api";

export function useMyWalletTransactions() {
	return useQuery({ queryKey: ["wallet-me-transactions"], queryFn: walletApi.myTransactions });
}
