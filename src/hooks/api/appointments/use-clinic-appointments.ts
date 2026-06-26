"use client";

import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { appointmentsApi } from "@/lib/api/appointments.api";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import { appointmentKeys } from "./appointment-keys";

export function useClinicAppointments(targetIds: string[]) {
	const results = useQueries({
		queries: targetIds.map((id) => ({
			queryKey: appointmentKeys.byProfessional(id),
			queryFn: () => appointmentsApi.getByProfessional(id, 0, 100),
		})),
	});

	const isLoading = results.some((r) => r.isLoading);

	const appointments: AppointmentResponse[] = useMemo(
		() => results.flatMap((r) => r.data?.content ?? []),
		// biome-ignore lint/correctness/useExhaustiveDependencies: results array changes reference every render
		[results],
	);

	return { appointments, isLoading };
}
