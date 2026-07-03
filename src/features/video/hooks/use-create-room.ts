"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentKeys } from "@/features/appointments";
import { videoRepository } from "../repositories/video.repository";

export function useCreateRoom() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (appointmentId: string) =>
			videoRepository.createRoom(appointmentId),
		onSuccess: (_data, appointmentId) => {
			queryClient.invalidateQueries({
				queryKey: appointmentKeys.detail(appointmentId),
			});
		},
	});
}
