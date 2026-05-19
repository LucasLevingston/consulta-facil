"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import type { DoctorResponse } from "@/lib/schemas/doctor.schema";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface DoctorsMapInnerProps {
  doctors: DoctorResponse[];
  center?: [number, number];
  zoom?: number;
}

export default function DoctorsMapInner({
  doctors,
  center = [-15.8, -47.9],
  zoom = 5,
}: DoctorsMapInnerProps) {
  const withLocation = doctors.filter(
    (d) => d.latitude != null && d.longitude != null
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
      {withLocation.map((doctor) => (
        <Marker
          key={doctor.id}
          position={[doctor.latitude!, doctor.longitude!]}
          icon={markerIcon}
        >
          <Popup>
            <div className="text-sm space-y-1">
              <p className="font-semibold">Dr. {doctor.name}</p>
              <p className="text-muted-foreground">{doctor.specialty}</p>
              {doctor.clinicName && <p>{doctor.clinicName}</p>}
              {doctor.city && (
                <p className="text-xs text-muted-foreground">
                  {doctor.city}{doctor.state ? `, ${doctor.state}` : ""}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
