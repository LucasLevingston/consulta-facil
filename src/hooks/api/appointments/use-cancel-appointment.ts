"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { appointmentsApi } from "@/lib/api/appointments.api";
import type { CancelAppointmentInput } from "@/lib/schemas/appointment/cancel-appointment.schema";
import { appointmentKeys } from "./appointment-keys";

export function useCancelAppointment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: CancelAppointmentInput }) =>
			appointmentsApi.cancel(id, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}
