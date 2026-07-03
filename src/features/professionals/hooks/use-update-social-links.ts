"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateSocialLinksInput } from "@/lib/schemas/professional/update-social-links.schema";
import { professionalsRepository } from "../repositories/professionals.repository";
import { professionalKeys } from "./professional-keys";

export function useUpdateSocialLinks() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdateSocialLinksInput) =>
			professionalsRepository.updateSocialLinks(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: professionalKeys.all }),
	});
}
