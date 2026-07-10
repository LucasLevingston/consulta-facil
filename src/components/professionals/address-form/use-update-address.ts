import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalKeys } from "@/components/professionals/hooks";
import { professionalProfileRepository } from "@/features/professionals";
import type { UpdateAddressInput } from "@/lib/schemas/professional/update-address.schema";

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
