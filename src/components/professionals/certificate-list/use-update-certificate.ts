import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalKeys } from "@/components/professionals/hooks";
import { professionalPortfolioRepository } from "@/features/professionals";
import type { ProfessionalCertificateInput } from "@/lib/schemas/professional/professional-certificate.schema";

export function useUpdateCertificate() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			certificateId,
			data,
		}: {
			certificateId: string;
			data: ProfessionalCertificateInput;
		}) =>
			professionalPortfolioRepository.updateCertificate(certificateId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
