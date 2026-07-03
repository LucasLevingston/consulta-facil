import { useSuspenseQuery } from "@tanstack/react-query";
import { analyticsRepository } from "../repositories/analytics.repository";
import { analyticsKeys } from "./analytics-keys";

export function useFinancialAnalytics() {
	return useSuspenseQuery({
		queryKey: analyticsKeys.financial(),
		queryFn: analyticsRepository.getFinancial,
	});
}
