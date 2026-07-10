import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalKeys } from "@/components/professionals/hooks";
import { professionalPortfolioRepository } from "@/features/professionals";

export function useDeleteCertificate() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (certificateId: string) =>
			professionalPortfolioRepository.deleteCertificate(certificateId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
