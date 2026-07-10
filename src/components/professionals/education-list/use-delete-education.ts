import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalKeys } from "@/components/professionals/hooks";
import { professionalPortfolioRepository } from "@/features/professionals";

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
