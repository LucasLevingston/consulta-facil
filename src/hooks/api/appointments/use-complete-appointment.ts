"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { appointmentLifecycleApi } from "@/lib/api/appointments/appointment-lifecycle.api";
import { appointmentKeys } from "./appointment-keys";

export function useCompleteAppointment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => appointmentLifecycleApi.complete(id),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}
