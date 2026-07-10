import { useSuspenseQuery } from "@tanstack/react-query";
import { analyticsKeys } from "@/components/analytics/hooks";
import { analyticsRepository } from "@/features/analytics";

export function useReferralAnalytics() {
	return useSuspenseQuery({
		queryKey: analyticsKeys.referrals(),
		queryFn: analyticsRepository.getReferrals,
	});
}
