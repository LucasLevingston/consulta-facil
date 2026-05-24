"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import type { ClinicResponse } from "@/lib/schemas/clinic.schema";

const markerIcon = L.icon({
	iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
	shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});

interface ClinicsMapInnerProps {
	clinics: ClinicResponse[];
	center?: [number, number];
	zoom?: number;
}

export default function ClinicsMapInner({
	clinics,
	center = [-15.8, -47.9],
	zoom = 5,
}: ClinicsMapInnerProps) {
	const withLocation = clinics.filter(
		(c) => c.latitude != null && c.longitude != null,
	);

	const mapCenter: [number, number] =
		withLocation.length > 0
			? [
					withLocation[0].latitude as number,
					withLocation[0].longitude as number,
				]
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
			{withLocation.map((clinic) => (
				<Marker
					key={clinic.id}
					position={[clinic.latitude as number, clinic.longitude as number]}
					icon={markerIcon}
				>
					<Popup>
						<div className="text-sm space-y-1">
							<p className="font-semibold">{clinic.name}</p>
							{clinic.members && clinic.members.length > 0 && (
								<p className="text-muted-foreground">
									{clinic.members.length} profissional
									{clinic.members.length !== 1 ? "is" : ""}
								</p>
							)}
							{clinic.address && <p>{clinic.address}</p>}
							{clinic.city && (
								<p className="text-xs text-muted-foreground">
									{clinic.city}
									{clinic.state ? `, ${clinic.state}` : ""}
								</p>
							)}
						</div>
					</Popup>
				</Marker>
			))}
		</MapContainer>
	);
}
