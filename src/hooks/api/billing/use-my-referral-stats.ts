"use client";

import { useQuery } from "@tanstack/react-query";
import { referralApi } from "@/lib/api/billing/referral.api";

export function useMyReferralStats() {
	return useQuery({ queryKey: ["referral-stats-me"], queryFn: referralApi.myStats });
}
