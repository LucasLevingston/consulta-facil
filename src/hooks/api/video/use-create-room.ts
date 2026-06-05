"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentKeys } from "@/hooks/api/appointments/appointment-keys";
import { createVideoRoomApi } from "@/lib/api/video/video.api";

export function useCreateRoom() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (appointmentId: string) => createVideoRoomApi(appointmentId),
		onSuccess: (_data, appointmentId) => {
			queryClient.invalidateQueries({
				queryKey: appointmentKeys.detail(appointmentId),
			});
		},
	});
}
