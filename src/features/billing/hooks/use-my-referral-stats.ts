"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { billingWalletRepository } from "../repositories/billing-wallet.repository";

export function useMyReferralStats() {
	return useSuspenseQuery({
		queryKey: ["referral-stats-me"],
		queryFn: billingWalletRepository.getMyReferralStats,
	});
}
