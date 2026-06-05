"use client";

import dynamic from "next/dynamic";

import type { ClinicResponse } from "@/lib/schemas/clinic/clinic-response.schema";

const ClinicsMapInner = dynamic(() => import("./ClinicsMapInner"), {
	ssr: false,
	loading: () => (
		<div className="h-full w-full flex items-center justify-center bg-muted rounded-lg">
			<p className="text-sm text-muted-foreground">Carregando mapa...</p>
		</div>
	),
});

interface ClinicsMapProps {
	clinics: ClinicResponse[];
	center?: [number, number];
	zoom?: number;
	className?: string;
}

export function ClinicsMap({
	clinics,
	center,
	zoom,
	className,
}: ClinicsMapProps) {
	return (
		<div className={className ?? "h-[420px] w-full"}>
			<ClinicsMapInner clinics={clinics} center={center} zoom={zoom} />
		</div>
	);
}
