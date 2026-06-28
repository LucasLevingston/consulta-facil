"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalProfileApi } from "@/lib/api/professionals/professional-profile.api";
import type { CreateProfessionalInput } from "@/lib/schemas/doctor/create-professional.schema";
import { professionalKeys } from "./professional-keys";

export function useUpdateProfessional() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			professionalId,
			data,
		}: {
			professionalId: string;
			data: CreateProfessionalInput;
		}) => professionalProfileApi.update(professionalId, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: professionalKeys.all }),
	});
}
