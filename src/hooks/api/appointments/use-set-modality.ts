"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { appointmentsApi } from "@/lib/api/appointments.api";
import type { SetModalityInput } from "@/lib/schemas/appointment/set-modality.schema";
import { appointmentKeys } from "./appointment-keys";

export function useSetModality() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: SetModalityInput }) =>
			appointmentsApi.setModality(id, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: appointmentKeys.all }),
	});
}
