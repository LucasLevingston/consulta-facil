"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { appointmentLifecycleApi } from "@/lib/api/appointments/appointment-lifecycle.api";
import type { CancelAppointmentInput } from "@/lib/schemas/appointment/cancel-appointment.schema";
import { appointmentKeys } from "./appointment-keys";

export function useCancelAppointment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: CancelAppointmentInput }) =>
			appointmentLifecycleApi.cancel(id, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}
