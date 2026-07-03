"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateBioInput } from "@/lib/schemas/doctor/update-bio.schema";
import { professionalsRepository } from "../repositories/professionals.repository";
import { professionalKeys } from "./professional-keys";

export function useUpdateBio() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdateBioInput) =>
			professionalsRepository.updateBio(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: professionalKeys.all }),
	});
}
