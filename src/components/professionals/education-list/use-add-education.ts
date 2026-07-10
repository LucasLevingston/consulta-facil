import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalKeys } from "@/components/professionals/hooks";
import { professionalPortfolioRepository } from "@/features/professionals";
import type { ProfessionalEducationInput } from "@/lib/schemas/professional/professional-education.schema";

export function useAddEducation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: ProfessionalEducationInput) =>
			professionalPortfolioRepository.addEducation(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
