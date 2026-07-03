import { useSuspenseQuery } from "@tanstack/react-query";
import { analyticsRepository } from "../repositories/analytics.repository";
import { analyticsKeys } from "./analytics-keys";

export function useReferralAnalytics() {
	return useSuspenseQuery({
		queryKey: analyticsKeys.referrals(),
		queryFn: analyticsRepository.getReferrals,
	});
}
