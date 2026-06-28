import { useQuery } from "@tanstack/react-query";
import { professionalsListingApi } from "@/lib/api/professionals/professionals.api";
import { professionalKeys } from "./professional-keys";

export function useProfessionalRatings(professionalId: string) {
	return useQuery({
		queryKey: professionalKeys.ratings(professionalId),
		queryFn: () => professionalsListingApi.getRatings(professionalId),
		enabled: !!professionalId,
	});
}
