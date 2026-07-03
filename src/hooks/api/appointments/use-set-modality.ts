"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { appointmentLifecycleApi } from "@/lib/api/appointments/appointment-lifecycle.api";
import type { SetModalityInput } from "@/lib/schemas/appointment/set-modality.schema";
import { appointmentKeys } from "./appointment-keys";

export function useSetModality() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: SetModalityInput }) =>
			appointmentLifecycleApi.setModality(id, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}
