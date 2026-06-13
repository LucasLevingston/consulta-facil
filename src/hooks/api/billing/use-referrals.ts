"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { referralApi } from "@/lib/api/billing/referral.api";

export function useMyReferralStats() {
	return useQuery({
		queryKey: ["referral-stats-me"],
		queryFn: referralApi.myStats,
	});
}

export function useRegenerateCode() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: referralApi.regenerate,
		onSuccess: () => qc.invalidateQueries({ queryKey: ["referral-stats-me"] }),
	});
}

export function useAdminReferrals() {
	return useQuery({
		queryKey: ["admin-referrals"],
		queryFn: referralApi.adminListAll,
	});
}
