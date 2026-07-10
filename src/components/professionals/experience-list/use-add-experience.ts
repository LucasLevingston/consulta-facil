import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalKeys } from "@/components/professionals/hooks";
import { professionalPortfolioRepository } from "@/features/professionals";
import type { ProfessionalExperienceInput } from "@/lib/schemas/professional/professional-experience.schema";

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
