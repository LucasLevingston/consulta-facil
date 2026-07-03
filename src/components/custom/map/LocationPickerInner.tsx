"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

import type {
	ClickHandlerProps,
	LocationPickerInnerProps,
} from "./LocationPickerInner.types";

const markerIcon = L.icon({
	iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
	shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});

function ClickHandler({ onLocationSelect }: ClickHandlerProps) {
	useMapEvents({
		click(e) {
			onLocationSelect(e.latlng.lat, e.latlng.lng);
		},
	});
	return null;
}

export default function LocationPickerInner({
	lat,
	lng,
	onLocationSelect,
}: LocationPickerInnerProps) {
	const center: [number, number] =
		lat != null && lng != null ? [lat, lng] : [-15.8, -47.9];

	return (
		<MapContainer
			center={center}
			zoom={lat != null ? 13 : 4}
			style={{ height: "100%", width: "100%" }}
			className="rounded-lg z-0"
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<ClickHandler onLocationSelect={onLocationSelect} />
			{lat != null && lng != null && (
				<Marker position={[lat, lng]} icon={markerIcon} />
			)}
		</MapContainer>
	);
}
