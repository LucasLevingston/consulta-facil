import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dependentsApi } from "@/lib/api/dependents/dependents.api";
import { dependentKeys } from "./dependent-keys";

export function useUpdateDependent() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: Parameters<typeof dependentsApi.update>[1];
		}) => dependentsApi.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: dependentKeys.my() });
		},
	});
}
