import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateAddressInput } from "@/lib/schemas/professional/update-address.schema";
import { professionalProfileRepository } from "../repositories/professional-profile.repository";
import { professionalKeys } from "./professional-keys";

export function useUpdateAddress() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdateAddressInput) =>
			professionalProfileRepository.updateAddress(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
