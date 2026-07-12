"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentKeys } from "@/components/appointments/hooks";
import { appointmentLifecycleRepository } from "@/features/appointments";
import type { CancelAppointmentInput } from "@/lib/schemas/appointment/cancel-appointment.schema";

export function useCancelAppointment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: CancelAppointmentInput }) =>
			appointmentLifecycleRepository.cancel(id, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}
