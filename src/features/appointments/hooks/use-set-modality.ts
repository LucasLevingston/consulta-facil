"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SetModalityInput } from "@/lib/schemas/appointment/set-modality.schema";
import { appointmentLifecycleRepository } from "../repositories/appointment-lifecycle.repository";
import { appointmentKeys } from "./appointment-keys";

export function useSetModality() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: SetModalityInput }) =>
			appointmentLifecycleRepository.setModality(id, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}
