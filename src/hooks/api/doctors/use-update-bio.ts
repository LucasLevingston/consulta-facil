import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalProfileApi } from "@/lib/api/professionals/professional-profile.api";
import type { UpdateBioInput } from "@/lib/schemas/doctor/update-bio.schema";
import { professionalKeys } from "./professional-keys";

export function useUpdateBio() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdateBioInput) =>
			professionalProfileApi.updateBio(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
