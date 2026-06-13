import { useQuery } from "@tanstack/react-query";
import { professionalsApi } from "@/lib/api/doctors.api";
import { professionalKeys } from "./professional-keys";

export function useProfessionalRatings(professionalId: string) {
	return useQuery({
		queryKey: professionalKeys.ratings(professionalId),
		queryFn: () => professionalsApi.getRatings(professionalId),
		enabled: !!professionalId,
	});
}
