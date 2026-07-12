"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentKeys } from "@/components/appointments/hooks";
import { appointmentsRepository } from "@/features/appointments";
import type { CreateAppointmentInput } from "@/lib/schemas/appointment/create-appointment.schema";

export function useScheduleAppointment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateAppointmentInput) =>
			appointmentsRepository.schedule(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}
