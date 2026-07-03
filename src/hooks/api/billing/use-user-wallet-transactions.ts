"use client";

import { useQuery } from "@tanstack/react-query";
import { walletApi } from "@/lib/api/billing/wallet.api";

export function useUserWalletTransactions(userId: string) {
	return useQuery({
		queryKey: ["user-wallet-transactions", userId],
		queryFn: () => walletApi.adminGetTransactions(userId),
		enabled: !!userId,
	});
}
