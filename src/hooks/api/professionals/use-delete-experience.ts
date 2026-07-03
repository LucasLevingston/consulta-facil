import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalPortfolioApi } from "@/lib/api/professionals/professional-portfolio.api";
import { professionalKeys } from "./professional-keys";

export function useDeleteExperience() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (experienceId: string) => professionalPortfolioApi.deleteExperience(experienceId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
