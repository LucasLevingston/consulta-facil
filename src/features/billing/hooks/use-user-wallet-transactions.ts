"use client";

import { useQuery } from "@tanstack/react-query";
import { billingWalletRepository } from "../repositories/billing-wallet.repository";

export function useUserWalletTransactions(userId: string) {
	return useQuery({
		queryKey: ["user-wallet-transactions", userId],
		queryFn: () => billingWalletRepository.getUserWalletTransactions(userId),
		enabled: !!userId,
	});
}
