"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CancelAppointmentInput } from "@/lib/schemas/appointment/cancel-appointment.schema";
import { appointmentLifecycleRepository } from "../repositories/appointment-lifecycle.repository";
import { appointmentKeys } from "./appointment-keys";

export function useCancelAppointment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: CancelAppointmentInput }) =>
			appointmentLifecycleRepository.cancel(id, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}
