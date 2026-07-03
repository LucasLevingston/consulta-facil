import { useQuery } from "@tanstack/react-query";
import { analyticsRepository } from "../repositories/analytics.repository";
import { analyticsKeys } from "./analytics-keys";

export function useAppointmentAnalytics() {
	return useQuery({
		queryKey: analyticsKeys.appointments(),
		queryFn: analyticsRepository.getAppointments,
	});
}
