"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateProfessionalInput } from "@/lib/schemas/doctor/create-professional.schema";
import { professionalsRepository } from "../repositories/professionals.repository";
import { professionalKeys } from "./professional-keys";

export function useUpdateProfessional() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			professionalId,
			data,
		}: {
			professionalId: string;
			data: CreateProfessionalInput;
		}) => professionalsRepository.update(professionalId, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: professionalKeys.all }),
	});
}
