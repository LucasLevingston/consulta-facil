import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalPortfolioRepository } from "../repositories/professional-portfolio.repository";
import { professionalKeys } from "./professional-keys";

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
