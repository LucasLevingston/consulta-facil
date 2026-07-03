"use client";

import { useQuery } from "@tanstack/react-query";
import { referralApi } from "@/lib/api/billing/referral.api";

export function useAdminReferrals() {
	return useQuery({ queryKey: ["admin-referrals"], queryFn: referralApi.adminListAll });
}
