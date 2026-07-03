"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingWalletRepository } from "../repositories/billing-wallet.repository";

export function useRegenerateCode() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: billingWalletRepository.regenerateReferralCode,
		onSuccess: () => qc.invalidateQueries({ queryKey: ["referral-stats-me"] }),
	});
}
