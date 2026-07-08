"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateAppointmentInput } from "@/lib/schemas/appointment/create-appointment.schema";
import { appointmentsRepository } from "../repositories/appointments.repository";
import { appointmentKeys } from "./appointment-keys";

export function useScheduleAppointment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateAppointmentInput) =>
			appointmentsRepository.schedule(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}
