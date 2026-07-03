"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateAddressInput } from "@/lib/schemas/doctor/update-address.schema";
import { professionalsRepository } from "../repositories/professionals.repository";
import { professionalKeys } from "./professional-keys";

export function useUpdateAddress() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdateAddressInput) =>
			professionalsRepository.updateAddress(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: professionalKeys.all }),
	});
}
