import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalKeys } from "@/components/professionals/hooks";
import { professionalProfileRepository } from "@/features/professionals";
import type { UpdateSocialLinksInput } from "@/lib/schemas/professional/update-social-links.schema";

export function useUpdateSocialLinks() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdateSocialLinksInput) =>
			professionalProfileRepository.updateSocialLinks(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
