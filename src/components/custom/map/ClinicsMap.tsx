"use client";

import dynamic from "next/dynamic";

import type { ClinicsMapProps } from "./ClinicsMap.types";

const ClinicsMapInner = dynamic(() => import("./ClinicsMapInner"), {
	ssr: false,
	loading: () => (
		<div className="h-full w-full flex items-center justify-center bg-muted rounded-lg">
			<p className="text-sm text-muted-foreground">Carregando mapa...</p>
		</div>
	),
});

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
