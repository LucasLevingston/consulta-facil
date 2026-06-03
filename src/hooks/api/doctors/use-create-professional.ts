"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalsApi } from "@/lib/api/doctors.api";
import type { CreateProfessionalInput } from "@/lib/schemas/doctor.schema";
import { professionalKeys } from "./professional-keys";

export function useCreateProfessional() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateProfessionalInput) =>
			professionalsApi.create(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: professionalKeys.all }),
	});
}
