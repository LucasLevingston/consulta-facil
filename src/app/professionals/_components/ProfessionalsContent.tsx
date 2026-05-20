"use client";

import {
	ChevronLeft,
	ChevronRight,
	LayoutList,
	Loader2,
	MapIcon,
	Navigation,
	Users,
	X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import DoctorFilters from "@/components/custom/doctor/DoctorFilters";
import DoctorsList from "@/components/custom/doctor/DoctorsClientList";
import { DoctorsMap } from "@/components/custom/map/DoctorsMap";
import PageHeader from "@/components/custom/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	useProfessionals,
	useProfessionalsNearby,
} from "@/hooks/api/use-doctors";
import { QueryBoundary } from "@/providers/query-boundary";

type ViewMode = "list" | "map";
const PAGE_SIZE = 12;

export default function ProfessionalsContent() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const name = searchParams.get("name") ?? "";
	const profession = searchParams.get("profession") ?? "";
	const specialty = searchParams.get("specialty") ?? "";
	const page = Number(searchParams.get("page") ?? "0");

	const [viewMode, setViewMode] = useState<ViewMode>("list");
	const [userLocation, setUserLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [locationLoading, setLocationLoading] = useState(false);
	const radiusKm = 50;

	const isNearbyMode = userLocation !== null;

	const {
		data: pageData,
		isLoading: listLoading,
		error: listError,
	} = useProfessionals(page, PAGE_SIZE, profession, specialty, name);

	const {
		data: nearbyDoctors = [],
		isLoading: nearbyLoading,
		error: nearbyError,
	} = useProfessionalsNearby(
		userLocation?.lat ?? null,
		userLocation?.lng ?? null,
		radiusKm,
		specialty || undefined,
		profession || undefined,
	);

	const isLoading = isNearbyMode ? nearbyLoading : listLoading;
	const error = isNearbyMode ? nearbyError : listError;

	const doctors = isNearbyMode ? nearbyDoctors : (pageData?.content ?? []);
	const totalPages = pageData?.totalPages ?? 1;
	const totalElements = pageData?.totalElements ?? 0;

	const doctorsWithLocation = doctors.filter(
		(d) => d.latitude != null && d.longitude != null,
	);

	function goToPage(p: number) {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", String(p));
		router.replace(`/professionals?${params.toString()}`);
	}

	function requestLocation() {
		if (!navigator.geolocation) return;
		setLocationLoading(true);
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				setUserLocation({
					lat: pos.coords.latitude,
					lng: pos.coords.longitude,
				});
				setViewMode("map");
				setLocationLoading(false);
			},
			() => setLocationLoading(false),
		);
	}

	function clearLocation() {
		setUserLocation(null);
	}

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			<PageHeader
				title="Profissionais"
				description="Encontre especialistas cadastrados na plataforma."
				icon={<Users className="h-6 w-6" />}
				count={isNearbyMode ? doctors.length : totalElements}
				countLabel="profissional"
			/>

			<div className="space-y-4">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<DoctorFilters />

					<div className="flex items-center gap-2 shrink-0">
						{isNearbyMode ? (
							<Badge
								variant="secondary"
								className="gap-1.5 px-3 py-1.5 rounded-full text-sm"
							>
								<Navigation className="h-3.5 w-3.5 text-primary" />
								Mais perto de você ({radiusKm}km)
								<button
									type="button"
									onClick={clearLocation}
									className="ml-0.5 hover:opacity-70 transition-opacity"
								>
									<X className="h-3.5 w-3.5" />
								</button>
							</Badge>
						) : (
							<Button
								variant="outline"
								size="sm"
								onClick={requestLocation}
								disabled={locationLoading}
								className="rounded-xl gap-2"
							>
								{locationLoading ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Navigation className="h-4 w-4" />
								)}
								Mais perto de você
							</Button>
						)}

						<div className="flex rounded-xl border overflow-hidden">
							<Button
								variant={viewMode === "list" ? "default" : "ghost"}
								size="sm"
								onClick={() => setViewMode("list")}
								className="rounded-none"
							>
								<LayoutList className="h-4 w-4" />
							</Button>
							<Button
								variant={viewMode === "map" ? "default" : "ghost"}
								size="sm"
								onClick={() => setViewMode("map")}
								className="rounded-none"
							>
								<MapIcon className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>

				{viewMode === "map" ? (
					<div className="space-y-3">
						{doctorsWithLocation.length === 0 && (
							<p className="text-sm text-muted-foreground">
								Nenhum profissional com localização cadastrada encontrado.
							</p>
						)}
						<DoctorsMap
							doctors={doctors}
							center={
								userLocation ? [userLocation.lat, userLocation.lng] : undefined
							}
							zoom={userLocation ? 10 : 5}
							className="h-[520px] w-full"
						/>
					</div>
				) : (
					<>
						<DoctorsList doctors={doctors} />

						{!isNearbyMode && totalPages > 1 && (
							<div className="flex items-center justify-center gap-2 pt-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => goToPage(page - 1)}
									disabled={page === 0}
									className="gap-1"
								>
									<ChevronLeft className="h-4 w-4" />
									Anterior
								</Button>

								<div className="flex items-center gap-1">
									{Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
										const pageIndex =
											totalPages <= 7
												? i
												: page < 4
													? i
													: page > totalPages - 4
														? totalPages - 7 + i
														: page - 3 + i;
										return (
											<Button
												key={pageIndex}
												variant={pageIndex === page ? "default" : "outline"}
												size="sm"
												onClick={() => goToPage(pageIndex)}
												className="h-8 w-8 p-0"
											>
												{pageIndex + 1}
											</Button>
										);
									})}
								</div>

								<Button
									variant="outline"
									size="sm"
									onClick={() => goToPage(page + 1)}
									disabled={page >= totalPages - 1}
									className="gap-1"
								>
									Próximo
									<ChevronRight className="h-4 w-4" />
								</Button>
							</div>
						)}
					</>
				)}
			</div>
		</QueryBoundary>
	);
}
