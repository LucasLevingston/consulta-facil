import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalPortfolioApi } from "@/lib/api/professionals/professional-portfolio.api";
import { professionalKeys } from "./professional-keys";

export function useDeleteEducation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (educationId: string) =>
			professionalPortfolioApi.deleteEducation(educationId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
