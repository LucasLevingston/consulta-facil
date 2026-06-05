"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { appointmentsApi } from "@/lib/api/appointments.api";
import type { RateAppointmentInput } from "@/lib/schemas/appointment/rate-appointment.schema";
import { appointmentKeys } from "./appointment-keys";

export function useRateAppointment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: RateAppointmentInput }) =>
			appointmentsApi.rate(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
			queryClient.invalidateQueries({ queryKey: ["professionals"] });
		},
	});
}
