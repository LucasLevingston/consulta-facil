import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalsApi } from "@/lib/api/doctors.api";
import type { ProfessionalExperienceInput } from "@/lib/schemas/doctor/professional-experience.schema";
import { professionalKeys } from "./professional-keys";

export function useAddExperience() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: ProfessionalExperienceInput) =>
			professionalsApi.addExperience(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
