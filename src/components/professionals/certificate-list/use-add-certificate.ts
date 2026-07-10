import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalKeys } from "@/components/professionals/hooks";
import { professionalPortfolioRepository } from "@/features/professionals";
import type { ProfessionalCertificateInput } from "@/lib/schemas/professional/professional-certificate.schema";

export function useAddCertificate() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: ProfessionalCertificateInput) =>
			professionalPortfolioRepository.addCertificate(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
