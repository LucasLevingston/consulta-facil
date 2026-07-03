"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProfessionalEducationInput } from "@/lib/schemas/doctor/professional-education.schema";
import { professionalsRepository } from "../repositories/professionals.repository";
import { professionalKeys } from "./professional-keys";

export function useUpdateEducation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			educationId,
			data,
		}: {
			educationId: string;
			data: ProfessionalEducationInput;
		}) => professionalsRepository.updateEducation(educationId, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: professionalKeys.all }),
	});
}
