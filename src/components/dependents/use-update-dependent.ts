import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dependentKeys } from "@/components/dependents/hooks";
import { dependentsRepository } from "@/features/dependents";
import type { CreateDependentInput } from "@/lib/schemas/dependent/create-dependent.schema";

export function useUpdateDependent() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: Partial<CreateDependentInput>;
		}) => dependentsRepository.update(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: dependentKeys.my() });
		},
	});
}
