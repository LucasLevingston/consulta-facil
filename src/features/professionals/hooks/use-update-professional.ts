"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateProfessionalInput } from "@/lib/schemas/professional/create-professional.schema";
import { professionalProfileRepository } from "../repositories/professional-profile.repository";
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
		}) => professionalProfileRepository.update(professionalId, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: professionalKeys.all }),
	});
}
