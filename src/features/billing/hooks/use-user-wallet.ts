"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { billingWalletRepository } from "../repositories/billing-wallet.repository";

export function useUserWallet(userId: string) {
	return useSuspenseQuery({
		queryKey: ["user-wallet", userId],
		queryFn: () => billingWalletRepository.getUserWallet(userId),
	});
}
