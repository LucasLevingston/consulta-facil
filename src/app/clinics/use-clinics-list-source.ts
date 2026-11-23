import { useClinics } from "./use-clinics";
import type { useClinicsLocation } from "./use-clinics-location";
import { useClinicsNearby } from "./use-clinics-nearby";

export function useClinicsListSource(
	loc: ReturnType<typeof useClinicsLocation>,
) {
	const isNearbyMode = loc.userLocation !== null;
	const { data: allClinics = [] } = useClinics();
	const { data: nearbyClinics = [] } = useClinicsNearby(
		loc.userLocation?.lat ?? 0,
		loc.userLocation?.lng ?? 0,
		loc.radiusKm,
	);

	return {
		isNearbyMode,
		allClinics,
		baseList: isNearbyMode ? nearbyClinics : allClinics,
		isLoading: false,
		error: null,
	};
}
