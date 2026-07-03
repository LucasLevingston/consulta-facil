import { useQuery } from "@tanstack/react-query";
import { analyticsRepository } from "../repositories/analytics.repository";
import { analyticsKeys } from "./analytics-keys";

export function useSubscriptionAnalytics() {
	return useQuery({
		queryKey: analyticsKeys.subscriptions(),
		queryFn: analyticsRepository.getSubscriptions,
	});
}
