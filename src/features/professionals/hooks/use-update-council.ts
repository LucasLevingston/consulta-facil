import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateCouncilInput } from "@/lib/schemas/professional/update-council.schema";
import { professionalProfileRepository } from "../repositories/professional-profile.repository";
import { professionalKeys } from "./professional-keys";

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
