import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dependentsApi } from "@/lib/api/dependents.api";
import { dependentKeys } from "./dependent-keys";

export function useCreateDependent() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: dependentsApi.create,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: dependentKeys.my() });
		},
	});
}
