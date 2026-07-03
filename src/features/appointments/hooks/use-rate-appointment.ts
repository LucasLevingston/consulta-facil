"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RateAppointmentInput } from "@/lib/schemas/appointment/rate-appointment.schema";
import { appointmentsRepository } from "../repositories/appointments.repository";
import { appointmentKeys } from "./appointment-keys";

export function useRateAppointment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: RateAppointmentInput }) =>
			appointmentsRepository.rate(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
			queryClient.invalidateQueries({ queryKey: ["professionals"] });
		},
	});
}
