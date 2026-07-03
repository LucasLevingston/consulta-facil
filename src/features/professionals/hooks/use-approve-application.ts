"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalsRepository } from "../repositories/professionals.repository";
import { applicationKeys, professionalKeys } from "./professional-keys";

export function useApproveApplication() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (professionalId: string) =>
			professionalsRepository.approveApplication(professionalId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: applicationKeys.all });
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
