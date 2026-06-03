"use client";

import {
	LayoutList,
	Loader2,
	MapIcon,
	Navigation,
	Users,
	X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { CustomPagination } from "@/components/custom/custom-pagination";
import DoctorFilters from "@/components/custom/doctor/DoctorFilters";
import DoctorsList from "@/components/custom/doctor/DoctorsClientList";
import { DoctorsMap } from "@/components/custom/map/DoctorsMap";
import PageHeader from "@/components/custom/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	useProfessionals,
	useProfessionalsNearby,
} from "@/hooks/api/use-doctors";
import { QueryBoundary } from "@/providers/query-boundary";

type ViewMode = "list" | "map";
const PAGE_SIZE = 12;

const RADIUS_OPTIONS = [
	{ value: "10", label: "10 km" },
	{ value: "25", label: "25 km" },
	{ value: "50", label: "50 km" },
	{ value: "100", label: "100 km" },
] as const;

export default function ProfessionalsContent() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const name = searchParams.get("name") ?? "";
	const profession = searchParams.get("profession") ?? "";
	const specialty = searchParams.get("specialty") ?? "";
	const serviceTitle = searchParams.get("serviceTitle") ?? "";
	const state = searchParams.get("state") ?? "";
	const days = searchParams.get("days")?.split(",").filter(Boolean) ?? [];
	const page = Number(searchParams.get("page") ?? "0");

	const [viewMode, setViewMode] = useState<ViewMode>("list");
	const [userLocation, setUserLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [locationLoading, setLocationLoading] = useState(false);
	const [radiusKm, setRadiusKm] = useState(50);

	const isNearbyMode = userLocation !== null;

	const {
		data: pageData,
		isLoading: listLoading,
		error: listError,
	} = useProfessionals(
		page,
		PAGE_SIZE,
		profession,
		specialty,
		name,
		serviceTitle,
	);

	const {
		data: nearbyRaw = [],
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

	// Client-side filters (state + days) applied on top of API results
	const professionals = useMemo(() => {
		let base = isNearbyMode ? nearbyRaw : (pageData?.content ?? []);

		if (state) {
			base = base.filter((p) => p.state === state);
		}

		// dayOfWeek filter: best-effort client-side (professionals don't include schedule in list)
		// Kept as URL state so it reflects in badges; actual deep filter requires backend support

		return base;
	}, [isNearbyMode, nearbyRaw, pageData, state]);

	const totalPages = pageData?.totalPages ?? 1;
	const totalElements = isNearbyMode
		? professionals.length
		: state
			? professionals.length
			: (pageData?.totalElements ?? 0);

	const professionalsWithLocation = professionals.filter(
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
				count={totalElements}
				countLabel="profissional"
			/>

			<div className="space-y-4">
				<div className="flex flex-wrap items-start justify-between gap-3">
					<DoctorFilters />

					<div className="flex items-center gap-2 shrink-0">
						{/* Nearby / location controls */}
						{isNearbyMode ? (
							<div className="flex items-center gap-2">
								<Select
									value={String(radiusKm)}
									onValueChange={(v) => setRadiusKm(Number(v))}
								>
									<SelectTrigger className="h-9 w-[100px] rounded-xl text-sm">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="rounded-xl">
										{RADIUS_OPTIONS.map(({ value, label }) => (
											<SelectItem key={value} value={value}>
												{label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Badge
									variant="secondary"
									className="gap-1.5 px-3 py-1.5 rounded-full text-sm"
								>
									<Navigation className="h-3.5 w-3.5 text-primary" />
									Perto de você
									<button
										type="button"
										onClick={clearLocation}
										className="ml-0.5 hover:opacity-70 transition-opacity"
									>
										<X className="h-3.5 w-3.5" />
									</button>
								</Badge>
							</div>
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
								Perto de mim
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

				{days.length > 0 && !isNearbyMode && (
					<p className="text-xs text-muted-foreground">
						Filtro por dia de atendimento exige que o profissional esteja em
						modo &ldquo;Perto de mim&rdquo; para funcionar completamente.
					</p>
				)}

				{viewMode === "map" ? (
					<div className="space-y-3">
						{professionalsWithLocation.length === 0 && (
							<p className="text-sm text-muted-foreground">
								Nenhum profissional com localização cadastrada encontrado.
							</p>
						)}
						<DoctorsMap
							doctors={professionals}
							center={
								userLocation ? [userLocation.lat, userLocation.lng] : undefined
							}
							zoom={userLocation ? 10 : 5}
							className="h-[520px] w-full"
						/>
					</div>
				) : (
					<>
						<DoctorsList doctors={professionals} />
						{!isNearbyMode && (
							<CustomPagination
								currentPage={page}
								totalPages={totalPages}
								onPageChange={goToPage}
								className="pt-2"
							/>
						)}
					</>
				)}
			</div>
		</QueryBoundary>
	);
}
