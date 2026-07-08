import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalPortfolioRepository } from "../repositories/professional-portfolio.repository";
import { professionalKeys } from "./professional-keys";

export function useDeleteEducation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (educationId: string) =>
			professionalPortfolioRepository.deleteEducation(educationId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
