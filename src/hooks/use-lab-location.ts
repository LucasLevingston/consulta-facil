"use client";

import { useState } from "react";

interface UseLabLocationReturn {
	userLocation: { lat: number; lng: number } | null;
	locationLoading: boolean;
	radiusKm: number;
	setRadiusKm: (v: number) => void;
	requestLocation: () => void;
	clearLocation: () => void;
}

export function useLabLocation(): UseLabLocationReturn {
	const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
	const [locationLoading, setLocationLoading] = useState(false);
	const [radiusKm, setRadiusKm] = useState(50);

	function requestLocation() {
		if (!navigator.geolocation) return;
		setLocationLoading(true);
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
				setLocationLoading(false);
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
