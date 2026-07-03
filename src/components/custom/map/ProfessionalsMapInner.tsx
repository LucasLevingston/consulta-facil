"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";
import type { ProfessionalsMapInnerProps } from "./ProfessionalsMapInner.types";

const markerIcon = L.icon({
	iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
	shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});

export default function ProfessionalsMapInner({
	professionals,
	center = [-15.8, -47.9],
	zoom = 5,
}: ProfessionalsMapInnerProps) {
	const withLocation = professionals.filter(
		(p) => p.latitude != null && p.longitude != null,
	);

	const mapCenter: [number, number] =
		withLocation.length > 0
			? [withLocation[0].latitude!, withLocation[0].longitude!]
			: center;

	return (
		<MapContainer
			center={mapCenter}
			zoom={zoom}
			style={{ height: "100%", width: "100%" }}
			className="rounded-lg z-0"
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{withLocation.map((professional) => (
				<Marker
					key={professional.id}
					position={[professional.latitude!, professional.longitude!]}
					icon={markerIcon}
				>
					<Popup>
						<div className="text-sm space-y-1">
							<p className="font-semibold">{professional.name}</p>
							<p className="text-muted-foreground">
								{SPECIALTY_LABELS[professional.specialty] ??
									professional.specialty}
							</p>
							{professional.clinicName && <p>{professional.clinicName}</p>}
							{professional.city && (
								<p className="text-xs text-muted-foreground">
									{professional.city}
									{professional.state ? `, ${professional.state}` : ""}
								</p>
							)}
						</div>
					</Popup>
				</Marker>
			))}
		</MapContainer>
	);
}
