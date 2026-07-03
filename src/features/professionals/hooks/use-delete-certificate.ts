"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalsRepository } from "../repositories/professionals.repository";
import { professionalKeys } from "./professional-keys";

export function useDeleteCertificate() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (certificateId: string) =>
			professionalsRepository.deleteCertificate(certificateId),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: professionalKeys.all }),
	});
}
