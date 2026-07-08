"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateProfessionalInput } from "@/lib/schemas/professional/create-professional.schema";
import { professionalApplicationsRepository } from "../repositories/professional-applications.repository";
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
