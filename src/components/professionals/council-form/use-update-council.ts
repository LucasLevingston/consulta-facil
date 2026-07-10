import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalKeys } from "@/components/professionals/hooks";
import { professionalProfileRepository } from "@/features/professionals";
import type { UpdateCouncilInput } from "@/lib/schemas/professional/update-council.schema";

export function useUpdateCouncil() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdateCouncilInput) =>
			professionalProfileRepository.updateCouncil(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
