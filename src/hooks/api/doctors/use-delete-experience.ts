import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalsApi } from "@/lib/api/doctors.api";
import { professionalKeys } from "./professional-keys";

export function useDeleteExperience() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (experienceId: string) =>
			professionalsApi.deleteExperience(experienceId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
