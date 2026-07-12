"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { appointmentKeys } from "@/components/appointments/hooks";
import { appointmentsRepository } from "@/features/appointments";

export function useAppointment(id: string) {
	return useSuspenseQuery({
		queryKey: appointmentKeys.detail(id),
		queryFn: () => appointmentsRepository.getById(id),
	});
}
