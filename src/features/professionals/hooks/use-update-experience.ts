import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProfessionalExperienceInput } from "@/lib/schemas/professional/professional-experience.schema";
import { professionalPortfolioRepository } from "../repositories/professional-portfolio.repository";
import { professionalKeys } from "./professional-keys";

export function useUpdateExperience() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			experienceId,
			data,
		}: {
			experienceId: string;
			data: ProfessionalExperienceInput;
		}) => professionalPortfolioRepository.updateExperience(experienceId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
