"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalApplicationsApi } from "@/lib/api/professionals/professional-applications.api";
import { applicationKeys } from "./application-keys";
import { professionalKeys } from "./professional-keys";

export function useApproveApplication() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (professionalId: string) => professionalApplicationsApi.approve(professionalId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: applicationKeys.all });
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
