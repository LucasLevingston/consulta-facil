"use client";

import { useQuery } from "@tanstack/react-query";
import { billingWalletRepository } from "../repositories/billing-wallet.repository";

export function useMyWallet() {
	return useQuery({
		queryKey: ["wallet-me"],
		queryFn: billingWalletRepository.getMyWallet,
	});
}
