import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalPortfolioRepository } from "../repositories/professional-portfolio.repository";
import { professionalKeys } from "./professional-keys";

export function useDeleteExperience() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (experienceId: string) =>
			professionalPortfolioRepository.deleteExperience(experienceId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
