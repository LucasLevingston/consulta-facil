"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { appointmentsApi } from "@/lib/api/appointments.api";
import { appointmentKeys } from "./appointment-keys";

export function useGenerateMeetLink() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => appointmentsApi.generateMeetLink(id),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}
