"use client";

import { useQuery } from "@tanstack/react-query";
import { billingWalletRepository } from "../repositories/billing-wallet.repository";

export function useAdminWallets() {
	return useQuery({
		queryKey: ["admin-wallets"],
		queryFn: billingWalletRepository.adminListWallets,
	});
}
