import { useQuery } from "@tanstack/react-query";
import { analyticsRepository } from "../repositories/analytics.repository";
import { analyticsKeys } from "./analytics-keys";

export function useFinancialAnalytics() {
	return useQuery({
		queryKey: analyticsKeys.financial(),
		queryFn: analyticsRepository.getFinancial,
	});
}
