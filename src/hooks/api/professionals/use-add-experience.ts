import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalPortfolioApi } from "@/lib/api/professionals/professional-portfolio.api";
import type { ProfessionalExperienceInput } from "@/lib/schemas/professional/professional-experience.schema";
import { professionalKeys } from "./professional-keys";

export function useAddExperience() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: ProfessionalExperienceInput) => professionalPortfolioApi.addExperience(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
