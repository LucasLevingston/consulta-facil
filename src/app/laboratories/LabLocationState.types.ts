export interface LabLocationState {
	userLocation: { lat: number; lng: number } | null;
	locationLoading: boolean;
	radiusKm: number;
}
