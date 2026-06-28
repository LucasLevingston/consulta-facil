import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalProfileApi } from "@/lib/api/professionals/professional-profile.api";
import type { UpdateCouncilInput } from "@/lib/schemas/doctor/update-council.schema";
import { professionalKeys } from "./professional-keys";

export function useUpdateCouncil() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdateCouncilInput) =>
			professionalProfileApi.updateCouncil(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
