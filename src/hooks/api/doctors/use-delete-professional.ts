"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalProfileApi } from "@/lib/api/professionals/professional-profile.api";
import { professionalKeys } from "./professional-keys";

export function useDeleteProfessional() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (professionalId: string) =>
			professionalProfileApi.delete(professionalId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: professionalKeys.all }),
	});
}
