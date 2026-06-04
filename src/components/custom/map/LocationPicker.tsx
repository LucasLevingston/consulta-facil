"use client";

import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";

const LocationPickerInner = dynamic(() => import("./LocationPickerInner"), {
	ssr: false,
	loading: () => (
		<div className="h-full w-full flex items-center justify-center bg-muted rounded-lg">
			<p className="text-sm text-muted-foreground">Carregando mapa...</p>
		</div>
	),
});

interface LocationPickerProps {
	lat: number | null;
	lng: number | null;
	onLocationSelect: (lat: number, lng: number) => void;
	className?: string;
}

export function LocationPicker({
	lat,
	lng,
	onLocationSelect,
	className,
}: LocationPickerProps) {
	return (
		<div className={className ?? "space-y-2"}>
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<MapPin className="h-4 w-4" />
				<span>Clique no mapa para definir a localização da clínica</span>
			</div>
			<div className="h-[300px] w-full border rounded-lg overflow-hidden">
				<LocationPickerInner
					lat={lat}
					lng={lng}
					onLocationSelect={onLocationSelect}
				/>
			</div>
			{lat != null && lng != null && (
				<p className="text-xs text-muted-foreground">
					Coordenadas: {lat.toFixed(6)}, {lng.toFixed(6)}
				</p>
			)}
		</div>
	);
}
