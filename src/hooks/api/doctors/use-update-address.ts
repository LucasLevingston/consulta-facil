import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalsApi } from "@/lib/api/doctors.api";
import type { UpdateAddressInput } from "@/lib/schemas/doctor/update-address.schema";
import { professionalKeys } from "./professional-keys";

export function useUpdateAddress() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdateAddressInput) =>
			professionalsApi.updateAddress(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
