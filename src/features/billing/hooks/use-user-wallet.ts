"use client";

import { useQuery } from "@tanstack/react-query";
import { billingWalletRepository } from "../repositories/billing-wallet.repository";

export function useUserWallet(userId: string) {
	return useQuery({
		queryKey: ["user-wallet", userId],
		queryFn: () => billingWalletRepository.getUserWallet(userId),
		enabled: !!userId,
	});
}
