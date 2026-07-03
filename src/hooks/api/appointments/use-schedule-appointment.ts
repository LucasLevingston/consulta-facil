"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { appointmentsCrudApi } from "@/lib/api/appointments/appointments.api";
import type { CreateAppointmentInput } from "@/lib/schemas/appointment/create-appointment.schema";
import { appointmentKeys } from "./appointment-keys";

export function useScheduleAppointment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateAppointmentInput) => appointmentsCrudApi.schedule(data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}
