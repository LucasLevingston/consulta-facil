import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalKeys } from "@/components/professionals/hooks";
import { professionalPortfolioRepository } from "@/features/professionals";
import type { ProfessionalEducationInput } from "@/lib/schemas/professional/professional-education.schema";

export function useUpdateEducation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			educationId,
			data,
		}: {
			educationId: string;
			data: ProfessionalEducationInput;
		}) => professionalPortfolioRepository.updateEducation(educationId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
