import { useSuspenseQuery } from "@tanstack/react-query";
import { analyticsKeys } from "@/components/analytics/hooks";
import {
	type AnalyticsPeriod,
	professionalAnalyticsRepository,
} from "@/features/analytics";

export function useProfessionalAnalytics(period: AnalyticsPeriod) {
	return useSuspenseQuery({
		queryKey: analyticsKeys.professional(period),
		queryFn: () => professionalAnalyticsRepository.getMine(period),
	});
}
