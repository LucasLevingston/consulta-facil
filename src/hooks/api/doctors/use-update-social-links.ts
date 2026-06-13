import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalsApi } from "@/lib/api/doctors.api";
import type { UpdateSocialLinksInput } from "@/lib/schemas/doctor/update-social-links.schema";
import { professionalKeys } from "./professional-keys";

export function useUpdateSocialLinks() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdateSocialLinksInput) =>
			professionalsApi.updateSocialLinks(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
