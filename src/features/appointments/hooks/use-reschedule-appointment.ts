"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RescheduleAppointmentInput } from "@/lib/schemas/appointment/reschedule-appointment.schema";
import { appointmentsRepository } from "../repositories/appointments.repository";
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
		}) => appointmentsRepository.reschedule(id, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}
