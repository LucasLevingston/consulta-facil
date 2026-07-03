"use client";

import { CustomPagination } from "@/components/custom/custom-pagination";
import { ProfessionalsMap } from "@/components/custom/map/ProfessionalsMap";
import ProfessionalsList from "@/components/custom/professional/ProfessionalsList";
import type { ProfessionalResponse } from "@/features/professionals";

interface Props {
	viewMode: "list" | "map";
	displayed: ProfessionalResponse[];
	professionalsWithLocation: ProfessionalResponse[];
	isNearbyMode: boolean;
	currentPage: number;
	totalPages: number;
	userLocation: { lat: number; lng: number } | null;
	onPageChange: (page: number) => void;
}

export function ProfessionalsViewContent({
	viewMode,
	displayed,
	professionalsWithLocation,
	isNearbyMode,
	currentPage,
	totalPages,
	userLocation,
	onPageChange,
}: Props) {
	if (viewMode === "map") {
		return (
			<div className="space-y-3">
				{professionalsWithLocation.length === 0 && (
					<p className="text-sm text-muted-foreground">
						Nenhum profissional com localização cadastrada encontrado.
					</p>
				)}
				<ProfessionalsMap
					professionals={displayed}
					center={
						userLocation ? [userLocation.lat, userLocation.lng] : undefined
					}
					zoom={userLocation ? 10 : 5}
					className="h-[520px] w-full"
				/>
			</div>
		);
	}
	return (
		<>
			<ProfessionalsList professionals={displayed} />
			{!isNearbyMode && (
				<CustomPagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={onPageChange}
					className="pt-2"
				/>
			)}
		</>
	);
}
