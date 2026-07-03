"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProfessionalCertificateInput } from "@/lib/schemas/professional/professional-certificate.schema";
import { professionalsRepository } from "../repositories/professionals.repository";
import { professionalKeys } from "./professional-keys";

export function useAddCertificate() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: ProfessionalCertificateInput) =>
			professionalsRepository.addCertificate(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: professionalKeys.all }),
	});
}
