"use client";

import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { appointmentKeys } from "@/components/appointments/hooks";
import { appointmentsRepository } from "@/features/appointments";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";

export function useClinicAppointments(targetIds: string[]) {
	const results = useQueries({
		queries: targetIds.map((id) => ({
			queryKey: appointmentKeys.byProfessional(id),
			queryFn: () => appointmentsRepository.getByProfessional(id, 0, 100),
		})),
	});

	const isLoading = results.some((r) => r.isLoading);

	const appointments: AppointmentResponse[] = useMemo(
		() => results.flatMap((r) => r.data?.content ?? []),
		[results],
	);

	return { appointments, isLoading };
}
