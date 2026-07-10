import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalKeys } from "@/components/professionals/hooks";
import { professionalPortfolioRepository } from "@/features/professionals";
import type { ProfessionalExperienceInput } from "@/lib/schemas/professional/professional-experience.schema";

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
