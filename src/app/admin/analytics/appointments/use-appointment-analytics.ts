import { useSuspenseQuery } from "@tanstack/react-query";
import { analyticsKeys } from "@/components/analytics/hooks";
import { analyticsRepository } from "@/features/analytics";

export function useAppointmentAnalytics() {
	return useSuspenseQuery({
		queryKey: analyticsKeys.appointments(),
		queryFn: analyticsRepository.getAppointments,
	});
}
