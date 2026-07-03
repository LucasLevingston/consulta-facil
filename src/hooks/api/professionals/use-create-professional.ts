"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalApplicationsApi } from "@/lib/api/professionals/professional-applications.api";
import type { CreateProfessionalInput } from "@/lib/schemas/professional/create-professional.schema";
import { professionalKeys } from "./professional-keys";

export function useCreateProfessional() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateProfessionalInput) => professionalApplicationsApi.create(data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: professionalKeys.all }),
	});
}
