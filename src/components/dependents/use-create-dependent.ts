import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dependentKeys } from "@/components/dependents/hooks";
import { dependentsRepository } from "@/features/dependents";

export function useCreateDependent() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: dependentsRepository.create,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: dependentKeys.my() });
		},
	});
}
