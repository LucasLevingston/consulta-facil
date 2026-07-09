"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { billingWalletRepository } from "../repositories/billing-wallet.repository";

export function useUserWalletTransactions(userId: string) {
	return useSuspenseQuery({
		queryKey: ["user-wallet-transactions", userId],
		queryFn: () => billingWalletRepository.getUserWalletTransactions(userId),
	});
}
