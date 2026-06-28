import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalPortfolioApi } from "@/lib/api/professionals/professional-portfolio.api";
import { professionalKeys } from "./professional-keys";

export function useDeleteCertificate() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (certificateId: string) =>
			professionalPortfolioApi.deleteCertificate(certificateId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
