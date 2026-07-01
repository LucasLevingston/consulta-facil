"use client";

import { useQuery } from "@tanstack/react-query";
import { billingWalletRepository } from "../repositories/billing-wallet.repository";

export function useAdminReferrals() {
	return useQuery({
		queryKey: ["admin-referrals"],
		queryFn: billingWalletRepository.adminListReferrals,
	});
}
