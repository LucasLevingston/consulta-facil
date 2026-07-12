"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentKeys } from "@/components/appointments/hooks";
import { appointmentsRepository } from "@/features/appointments";
import type { RescheduleAppointmentInput } from "@/lib/schemas/appointment/reschedule-appointment.schema";

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
