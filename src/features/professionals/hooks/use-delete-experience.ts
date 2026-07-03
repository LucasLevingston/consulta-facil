"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalsRepository } from "../repositories/professionals.repository";
import { professionalKeys } from "./professional-keys";

export function useDeleteExperience() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (experienceId: string) =>
			professionalsRepository.deleteExperience(experienceId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: professionalKeys.all }),
	});
}
