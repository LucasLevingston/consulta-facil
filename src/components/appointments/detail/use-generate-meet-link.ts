"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentKeys } from "@/components/appointments/hooks";
import { appointmentVideoRepository } from "@/features/appointments";

export function useGenerateMeetLink() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => appointmentVideoRepository.generateMeetLink(id),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}
