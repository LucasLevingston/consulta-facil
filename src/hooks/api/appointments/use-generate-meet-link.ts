"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { appointmentVideoApi } from "@/lib/api/appointments/appointment-video.api";
import { appointmentKeys } from "./appointment-keys";

export function useGenerateMeetLink() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => appointmentVideoApi.generateMeetLink(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}
