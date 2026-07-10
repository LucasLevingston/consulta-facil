import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalKeys } from "@/components/professionals/hooks";
import { professionalProfileRepository } from "@/features/professionals";
import type { UpdateBioInput } from "@/lib/schemas/professional/update-bio.schema";

export function useUpdateBio() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdateBioInput) =>
			professionalProfileRepository.updateBio(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
