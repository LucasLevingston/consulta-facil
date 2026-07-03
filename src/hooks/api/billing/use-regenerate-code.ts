"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { referralApi } from "@/lib/api/billing/referral.api";

export function useRegenerateCode() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: referralApi.regenerate,
		onSuccess: () => qc.invalidateQueries({ queryKey: ["referral-stats-me"] }),
	});
}
