import { useMutation, useQueryClient } from "@tanstack/react-query";
import { professionalsApi } from "@/lib/api/doctors.api";
import { professionalKeys } from "./professional-keys";

export function useDeleteCertificate() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (certificateId: string) =>
			professionalsApi.deleteCertificate(certificateId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: professionalKeys.all });
		},
	});
}
