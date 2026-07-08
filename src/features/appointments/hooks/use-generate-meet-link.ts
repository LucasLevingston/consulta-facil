"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentVideoRepository } from "../repositories/appointment-video.repository";
import { appointmentKeys } from "./appointment-keys";

export function useGenerateMeetLink() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => appointmentVideoRepository.generateMeetLink(id),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}
