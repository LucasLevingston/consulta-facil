"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { billingWalletRepository } from "../repositories/billing-wallet.repository";

export function useAdminWallets() {
	return useSuspenseQuery({
		queryKey: ["admin-wallets"],
		queryFn: billingWalletRepository.adminListWallets,
	});
}
