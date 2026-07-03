import { useSuspenseQuery } from "@tanstack/react-query";
import { analyticsRepository } from "../repositories/analytics.repository";
import { analyticsKeys } from "./analytics-keys";

export function useAppointmentAnalytics() {
	return useSuspenseQuery({
		queryKey: analyticsKeys.appointments(),
		queryFn: analyticsRepository.getAppointments,
	});
}
