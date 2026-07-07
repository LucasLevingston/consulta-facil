export interface ProfessionalsLocationState {
	userLocation: { lat: number; lng: number } | null;
	locationLoading: boolean;
	radiusKm: number;
}
