import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalPortfolioApi } from "@/lib/api/professionals/professional-portfolio.api";
import type { ProfessionalCertificateInput } from "@/lib/schemas/doctor/professional-certificate.schema";
import { professionalKeys } from "./professional-keys";

export function useUpdateCertificate() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			certificateId,
			data,
		}: {
			certificateId: string;
			data: ProfessionalCertificateInput;
		}) => professionalPortfolioApi.updateCertificate(certificateId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
