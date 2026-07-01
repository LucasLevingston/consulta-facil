"use client";

import { useState } from "react";
import type { ProfessionalsViewMode } from "./ProfessionalsViewMode.types";

interface UseProfessionalsLocationReturn {
	userLocation: { lat: number; lng: number } | null;
	locationLoading: boolean;
	radiusKm: number;
	viewMode: ProfessionalsViewMode;
	setViewMode: (v: ProfessionalsViewMode) => void;
	setRadiusKm: (v: number) => void;
	requestLocation: () => void;
	clearLocation: () => void;
}

export function useProfessionalsLocation(): UseProfessionalsLocationReturn {
	const [viewMode, setViewMode] = useState<ProfessionalsViewMode>("list");
	const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
	const [locationLoading, setLocationLoading] = useState(false);
	const [radiusKm, setRadiusKm] = useState(50);

	function requestLocation() {
		if (!navigator.geolocation) return;
		setLocationLoading(true);
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
				setViewMode("map");
				setLocationLoading(false);
			},
			() => setLocationLoading(false),
		);
	}

	return {
		userLocation,
		locationLoading,
		radiusKm,
		viewMode,
		setViewMode,
		setRadiusKm,
		requestLocation,
		clearLocation: () => setUserLocation(null),
	};
}
