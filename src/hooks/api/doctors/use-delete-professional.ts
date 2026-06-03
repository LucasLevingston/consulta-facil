"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalsApi } from "@/lib/api/doctors.api";
import { professionalKeys } from "./professional-keys";

export function useDeleteProfessional() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (professionalId: string) =>
			professionalsApi.delete(professionalId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: professionalKeys.all }),
	});
}
