import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalsApi } from "@/lib/api/doctors.api";
import type { ProfessionalEducationInput } from "@/lib/schemas/doctor/professional-education.schema";
import { professionalKeys } from "./professional-keys";

export function useAddEducation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: ProfessionalEducationInput) =>
			professionalsApi.addEducation(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
