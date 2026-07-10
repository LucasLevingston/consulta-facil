import { useSuspenseQuery } from "@tanstack/react-query";
import { analyticsKeys } from "@/components/analytics/hooks";
import { analyticsRepository } from "@/features/analytics";

export function useFinancialAnalytics() {
	return useSuspenseQuery({
		queryKey: analyticsKeys.financial(),
		queryFn: analyticsRepository.getFinancial,
	});
}
