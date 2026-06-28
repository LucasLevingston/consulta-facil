import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalPortfolioApi } from "@/lib/api/professionals/professional-portfolio.api";
import type { ProfessionalExperienceInput } from "@/lib/schemas/doctor/professional-experience.schema";
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
		}) => professionalPortfolioApi.updateExperience(experienceId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
