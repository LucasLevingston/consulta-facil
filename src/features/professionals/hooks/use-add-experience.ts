import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProfessionalExperienceInput } from "@/lib/schemas/professional/professional-experience.schema";
import { professionalPortfolioRepository } from "../repositories/professional-portfolio.repository";
import { professionalKeys } from "./professional-keys";

export function useAddExperience() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: ProfessionalExperienceInput) =>
			professionalPortfolioRepository.addExperience(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
