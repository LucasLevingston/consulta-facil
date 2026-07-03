import { useSuspenseQuery } from "@tanstack/react-query";
import { analyticsRepository } from "../repositories/analytics.repository";
import { analyticsKeys } from "./analytics-keys";

export function useUserAnalytics() {
	return useSuspenseQuery({
		queryKey: analyticsKeys.users(),
		queryFn: analyticsRepository.getUsers,
	});
}
