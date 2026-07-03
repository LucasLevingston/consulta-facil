"use client";

import dynamic from "next/dynamic";

import type { ProfessionalsMapProps } from "./ProfessionalsMap.types";

const ProfessionalsMapInner = dynamic(() => import("./ProfessionalsMapInner"), {
	ssr: false,
	loading: () => (
		<div className="h-full w-full flex items-center justify-center bg-muted rounded-lg">
			<p className="text-sm text-muted-foreground">Carregando mapa...</p>
		</div>
	),
});

export function ProfessionalsMap({
	professionals,
	center,
	zoom,
	className,
}: ProfessionalsMapProps) {
	return (
		<div className={className ?? "h-[420px] w-full"}>
			<ProfessionalsMapInner
				professionals={professionals}
				center={center}
				zoom={zoom}
			/>
		</div>
	);
}
