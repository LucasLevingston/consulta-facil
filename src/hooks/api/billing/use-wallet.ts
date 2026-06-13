"use client";

import { useQuery } from "@tanstack/react-query";
import { walletApi } from "@/lib/api/billing/wallet.api";

export function useMyWallet() {
	return useQuery({
		queryKey: ["wallet-me"],
		queryFn: walletApi.myWallet,
	});
}

export function useMyWalletTransactions() {
	return useQuery({
		queryKey: ["wallet-me-transactions"],
		queryFn: walletApi.myTransactions,
	});
}

export function useAdminWallets() {
	return useQuery({
		queryKey: ["admin-wallets"],
		queryFn: walletApi.adminListAll,
	});
}

export function useUserWallet(userId: string) {
	return useQuery({
		queryKey: ["user-wallet", userId],
		queryFn: () => walletApi.adminGetWallet(userId),
		enabled: !!userId,
	});
}

export function useUserWalletTransactions(userId: string) {
	return useQuery({
		queryKey: ["user-wallet-transactions", userId],
		queryFn: () => walletApi.adminGetTransactions(userId),
		enabled: !!userId,
	});
}
