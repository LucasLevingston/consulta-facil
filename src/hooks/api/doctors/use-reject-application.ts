"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalsApi } from "@/lib/api/doctors.api";
import { applicationKeys } from "./application-keys";
import { professionalKeys } from "./professional-keys";

export function useRejectApplication() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (professionalId: string) =>
			professionalsApi.reject(professionalId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: applicationKeys.all });
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
