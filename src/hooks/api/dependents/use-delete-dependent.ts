import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dependentsApi } from "@/lib/api/dependents/dependents.api";
import { dependentKeys } from "./dependent-keys";

export function useDeleteDependent() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => dependentsApi.remove(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: dependentKeys.my() });
		},
	});
}
