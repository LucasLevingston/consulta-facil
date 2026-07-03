"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalsRepository } from "../repositories/professionals.repository";
import { professionalKeys } from "./professional-keys";

export function useDeleteEducation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (educationId: string) =>
			professionalsRepository.deleteEducation(educationId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: professionalKeys.all }),
	});
}
