"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { billingWalletRepository } from "../repositories/billing-wallet.repository";

export function useMyWallet() {
	return useSuspenseQuery({
		queryKey: ["wallet-me"],
		queryFn: billingWalletRepository.getMyWallet,
	});
}
