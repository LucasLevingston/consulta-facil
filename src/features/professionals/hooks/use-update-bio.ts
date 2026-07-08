import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateBioInput } from "@/lib/schemas/professional/update-bio.schema";
import { professionalProfileRepository } from "../repositories/professional-profile.repository";
import { professionalKeys } from "./professional-keys";

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
