"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { clinicsCrudApi } from "@/lib/api/clinics/clinics.api";
import type { CreateClinicInput } from "@/lib/schemas/clinic/create-clinic.schema";
import { clinicKeys } from "./clinic-keys";

export function useCreateClinic() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateClinicInput) => clinicsCrudApi.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: clinicKeys.all });
		},
	});
}
