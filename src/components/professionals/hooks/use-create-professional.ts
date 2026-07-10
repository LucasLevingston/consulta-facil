"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalApplicationsRepository } from "@/features/professionals";
import type { CreateProfessionalInput } from "@/lib/schemas/professional/create-professional.schema";
import { professionalKeys } from "./professional-keys";

export function useCreateProfessional() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateProfessionalInput) =>
			professionalApplicationsRepository.create(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: professionalKeys.all }),
	});
}
