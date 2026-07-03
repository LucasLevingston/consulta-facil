"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProfessionalCertificateInput } from "@/lib/schemas/professional/professional-certificate.schema";
import { professionalsRepository } from "../repositories/professionals.repository";
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
		}) => professionalsRepository.updateCertificate(certificateId, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: professionalKeys.all }),
	});
}
