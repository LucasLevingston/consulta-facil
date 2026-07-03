"use client";

import { useMapEvents } from "react-leaflet";
import type { ClickHandlerProps } from "./LocationPickerInner.types";

export function ClickHandler({ onLocationSelect }: ClickHandlerProps) {
	useMapEvents({
		click(e) {
			onLocationSelect(e.latlng.lat, e.latlng.lng);
		},
	});
	return null;
}
