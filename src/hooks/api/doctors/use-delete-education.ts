import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalsApi } from "@/lib/api/doctors.api";
import { professionalKeys } from "./professional-keys";

export function useDeleteEducation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (educationId: string) =>
			professionalsApi.deleteEducation(educationId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
