"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { appointmentsApi } from "@/lib/api/appointments.api";
import type { RescheduleAppointmentInput } from "@/lib/schemas/appointment/reschedule-appointment.schema";
import { appointmentKeys } from "./appointment-keys";

export function useRescheduleAppointment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: RescheduleAppointmentInput;
		}) => appointmentsApi.reschedule(id, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}
