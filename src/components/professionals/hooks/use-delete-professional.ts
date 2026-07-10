"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalProfileRepository } from "@/features/professionals";
import { professionalKeys } from "./professional-keys";

export function useDeleteProfessional() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (professionalId: string) =>
			professionalProfileRepository.delete(professionalId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: professionalKeys.all }),
	});
}
