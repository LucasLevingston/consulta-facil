import { useClinics } from "@/hooks/api/clinics/use-clinics";
import { useClinicsNearby } from "@/hooks/api/clinics/use-clinics-nearby";
import type { useClinicsLocation } from "./use-clinics-location";

export function useClinicsListSource(
	loc: ReturnType<typeof useClinicsLocation>,
) {
	const isNearbyMode = loc.userLocation !== null;
	const {
		data: allClinics = [],
		isLoading: allLoading,
		error: allError,
	} = useClinics();
	const {
		data: nearbyClinics = [],
		isLoading: nearbyLoading,
		error: nearbyError,
	} = useClinicsNearby(
		loc.userLocation?.lat ?? null,
		loc.userLocation?.lng ?? null,
		loc.radiusKm,
	);

	return {
		isNearbyMode,
		allClinics,
		baseList: isNearbyMode ? nearbyClinics : allClinics,
		isLoading: isNearbyMode ? nearbyLoading : allLoading,
		error: isNearbyMode ? nearbyError : allError,
	};
}
