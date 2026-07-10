import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalKeys } from "@/components/professionals/hooks";
import { professionalPortfolioRepository } from "@/features/professionals";

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
