"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { billingWalletRepository } from "@/features/billing/repositories/billing-wallet.repository";

export function useMyWalletTransactions() {
	return useSuspenseQuery({
		queryKey: ["wallet-me-transactions"],
		queryFn: billingWalletRepository.getMyWalletTransactions,
	});
}
