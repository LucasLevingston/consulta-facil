import { useSuspenseQuery } from "@tanstack/react-query";
import { analyticsKeys } from "@/components/analytics/hooks";
import { analyticsRepository } from "@/features/analytics";

export function useUserAnalytics() {
	return useSuspenseQuery({
		queryKey: analyticsKeys.users(),
		queryFn: analyticsRepository.getUsers,
	});
}
