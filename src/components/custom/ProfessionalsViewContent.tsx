"use client";

import { CustomPagination } from "@/components/custom/custom-pagination";
import DoctorsList from "@/components/custom/doctor/DoctorsClientList";
import { DoctorsMap } from "@/components/custom/map/DoctorsMap";
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
				<DoctorsMap
					doctors={displayed}
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
			<DoctorsList doctors={displayed} />
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
