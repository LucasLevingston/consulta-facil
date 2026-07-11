"use client";

import { useState } from "react";

interface UseClinicsLocationReturn {
	userLocation: { lat: number; lng: number } | null;
	locationLoading: boolean;
	radiusKm: number;
	setRadiusKm: (v: number) => void;
	requestLocation: (onSuccess?: () => void) => void;
	clearLocation: () => void;
}

export function useClinicsLocation(): UseClinicsLocationReturn {
	const [userLocation, setUserLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [locationLoading, setLocationLoading] = useState(false);
	const [radiusKm, setRadiusKm] = useState(50);

	function requestLocation(onSuccess?: () => void) {
		if (!navigator.geolocation) return;
		setLocationLoading(true);
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				setUserLocation({
					lat: pos.coords.latitude,
					lng: pos.coords.longitude,
				});
				setLocationLoading(false);
				onSuccess?.();
			},
			() => setLocationLoading(false),
		);
	}

	return {
		userLocation,
		locationLoading,
		radiusKm,
		setRadiusKm,
		requestLocation,
		clearLocation: () => setUserLocation(null),
	};
}
