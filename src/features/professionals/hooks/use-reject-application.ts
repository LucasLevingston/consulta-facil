"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalApplicationsRepository } from "../repositories/professional-applications.repository";
import { applicationKeys } from "./application-keys";
import { professionalKeys } from "./professional-keys";

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
