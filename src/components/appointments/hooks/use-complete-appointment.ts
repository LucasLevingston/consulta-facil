"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentLifecycleRepository } from "@/features/appointments";
import { appointmentKeys } from "./appointment-keys";

export function useCompleteAppointment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => appointmentLifecycleRepository.complete(id),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}
