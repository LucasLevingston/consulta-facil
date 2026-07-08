import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProfessionalEducationInput } from "@/lib/schemas/professional/professional-education.schema";
import { professionalPortfolioRepository } from "../repositories/professional-portfolio.repository";
import { professionalKeys } from "./professional-keys";

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
