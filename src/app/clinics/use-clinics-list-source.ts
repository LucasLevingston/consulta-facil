import { useClinics } from "./use-clinics";
import type { useClinicsLocation } from "./use-clinics-location";
import { useClinicsNearby } from "./use-clinics-nearby";

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
