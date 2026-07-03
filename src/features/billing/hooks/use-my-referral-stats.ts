"use client";

import { useQuery } from "@tanstack/react-query";
import { billingWalletRepository } from "../repositories/billing-wallet.repository";

export function useMyReferralStats() {
	return useQuery({
		queryKey: ["referral-stats-me"],
		queryFn: billingWalletRepository.getMyReferralStats,
	});
}
