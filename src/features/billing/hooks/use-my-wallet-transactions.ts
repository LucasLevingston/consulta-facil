"use client";

import { useQuery } from "@tanstack/react-query";
import { billingWalletRepository } from "../repositories/billing-wallet.repository";

export function useMyWalletTransactions() {
	return useQuery({
		queryKey: ["wallet-me-transactions"],
		queryFn: billingWalletRepository.getMyWalletTransactions,
	});
}
