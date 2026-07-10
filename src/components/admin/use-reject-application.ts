"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	applicationKeys,
	professionalKeys,
} from "@/components/professionals/hooks";
import { professionalApplicationsRepository } from "@/features/professionals";

export function useRejectApplication() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (professionalId: string) =>
			professionalApplicationsRepository.reject(professionalId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: applicationKeys.all });
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
