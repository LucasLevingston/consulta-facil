import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalProfileApi } from "@/lib/api/professionals/professional-profile.api";
import type { UpdateSocialLinksInput } from "@/lib/schemas/professional/update-social-links.schema";
import { professionalKeys } from "./professional-keys";

export function useUpdateSocialLinks() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdateSocialLinksInput) => professionalProfileApi.updateSocialLinks(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
