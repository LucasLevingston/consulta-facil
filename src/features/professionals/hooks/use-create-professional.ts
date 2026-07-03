"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateProfessionalInput } from "@/lib/schemas/doctor/create-professional.schema";
import { professionalsRepository } from "../repositories/professionals.repository";
import { professionalKeys } from "./professional-keys";

export function useCreateProfessional() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateProfessionalInput) =>
			professionalsRepository.createApplication(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: professionalKeys.all }),
	});
}
