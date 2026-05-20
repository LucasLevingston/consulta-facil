"use client";

import dynamic from "next/dynamic";

import type { ProfessionalResponse } from "@/lib/schemas/doctor.schema";

const DoctorsMapInner = dynamic(() => import("./DoctorsMapInner"), {
	ssr: false,
	loading: () => (
		<div className="h-full w-full flex items-center justify-center bg-muted rounded-lg">
			<p className="text-sm text-muted-foreground">Carregando mapa...</p>
		</div>
	),
});

interface DoctorsMapProps {
	doctors: ProfessionalResponse[];
	center?: [number, number];
	zoom?: number;
	className?: string;
}

export function DoctorsMap({
	doctors,
	center,
	zoom,
	className,
}: DoctorsMapProps) {
	return (
		<div className={className ?? "h-[420px] w-full"}>
			<DoctorsMapInner doctors={doctors} center={center} zoom={zoom} />
		</div>
	);
}
