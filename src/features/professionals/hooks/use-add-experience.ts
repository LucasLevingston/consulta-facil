"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProfessionalExperienceInput } from "@/lib/schemas/doctor/professional-experience.schema";
import { professionalsRepository } from "../repositories/professionals.repository";
import { professionalKeys } from "./professional-keys";

export function useAddExperience() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: ProfessionalExperienceInput) =>
			professionalsRepository.addExperience(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: professionalKeys.all }),
	});
}
