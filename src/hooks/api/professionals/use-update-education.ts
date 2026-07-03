import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalPortfolioApi } from "@/lib/api/professionals/professional-portfolio.api";
import type { ProfessionalEducationInput } from "@/lib/schemas/professional/professional-education.schema";
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
		}) => professionalPortfolioApi.updateEducation(educationId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
