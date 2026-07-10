import { useSuspenseQuery } from "@tanstack/react-query";
import { analyticsKeys } from "@/components/analytics/hooks";
import { analyticsRepository } from "@/features/analytics";

export function useSubscriptionAnalytics() {
	return useSuspenseQuery({
		queryKey: analyticsKeys.subscriptions(),
		queryFn: analyticsRepository.getSubscriptions,
	});
}
