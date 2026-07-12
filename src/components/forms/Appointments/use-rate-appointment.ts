"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentKeys } from "@/components/appointments/hooks";
import { appointmentRatingsRepository } from "@/features/appointments";
import type { RateAppointmentInput } from "@/lib/schemas/appointment/rate-appointment.schema";

export function useRateAppointment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: RateAppointmentInput }) =>
			appointmentRatingsRepository.rate(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
			queryClient.invalidateQueries({ queryKey: ["professionals"] });
		},
	});
}
