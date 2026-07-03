"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { appointmentsCrudApi } from "@/lib/api/appointments/appointments.api";
import { appointmentKeys } from "./appointment-keys";

export function useDeleteAppointment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => appointmentsCrudApi.delete(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}
