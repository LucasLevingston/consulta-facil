import { useQuery } from "@tanstack/react-query";
import { analyticsRepository } from "../repositories/analytics.repository";
import { analyticsKeys } from "./analytics-keys";

export function useUserAnalytics() {
	return useQuery({
		queryKey: analyticsKeys.users(),
		queryFn: analyticsRepository.getUsers,
	});
}
