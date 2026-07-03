"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { appointmentRatingsApi } from "@/lib/api/appointments/appointment-ratings.api";
import type { RateAppointmentInput } from "@/lib/schemas/appointment/rate-appointment.schema";
import { appointmentKeys } from "./appointment-keys";

export function useRateAppointment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: RateAppointmentInput }) =>
			appointmentRatingsApi.rate(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
			queryClient.invalidateQueries({ queryKey: ["professionals"] });
		},
	});
}
