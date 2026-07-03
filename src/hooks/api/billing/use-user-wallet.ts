"use client";

import { useQuery } from "@tanstack/react-query";
import { walletApi } from "@/lib/api/billing/wallet.api";

export function useUserWallet(userId: string) {
	return useQuery({
		queryKey: ["user-wallet", userId],
		queryFn: () => walletApi.adminGetWallet(userId),
		enabled: !!userId,
	});
}
