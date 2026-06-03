"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalsApi } from "@/lib/api/doctors.api";
import type { CreateProfessionalInput } from "@/lib/schemas/doctor.schema";
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
		}) => professionalsApi.update(professionalId, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: professionalKeys.all }),
	});
}
