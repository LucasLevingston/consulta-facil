"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateCouncilInput } from "@/lib/schemas/doctor/update-council.schema";
import { professionalsRepository } from "../repositories/professionals.repository";
import { professionalKeys } from "./professional-keys";

export function useUpdateCouncil() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdateCouncilInput) =>
			professionalsRepository.updateCouncil(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: professionalKeys.all }),
	});
}
