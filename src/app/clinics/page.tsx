"use client";

import { Building2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ClinicsFilters } from "@/components/clinics/ClinicsFilters";
import ClinicCard from "@/components/custom/clinic/ClinicCard";
import { ClinicsMap } from "@/components/custom/map/ClinicsMap";
import PageHeader from "@/components/custom/page-header";
import { Button } from "@/components/ui/button";
import { useClinics } from "@/hooks/api/clinics/use-clinics";
import { useClinicsNearby } from "@/hooks/api/clinics/use-clinics-nearby";
import { QueryBoundary } from "@/providers/query-boundary";
import type { DayKey } from "@/utils/constants/days-of-week";

type ViewMode = "list" | "map";

export default function ClinicsPage() {
	const [viewMode, setViewMode] = useState<ViewMode>("list");
	const [userLocation, setUserLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [locationLoading, setLocationLoading] = useState(false);
	const [radiusKm, setRadiusKm] = useState(50);

	const [search, setSearch] = useState("");
	const [filterState, setFilterState] = useState("");
	const [filterCity, setFilterCity] = useState("");
	const [filterSpecialty, setFilterSpecialty] = useState("");
	const [filterProfession, setFilterProfession] = useState("");
	const [selectedDays, setSelectedDays] = useState<DayKey[]>([]);
	const [expanded, setExpanded] = useState(false);

	const isNearbyMode = userLocation !== null;

	const {
		data: allClinics = [],
		isLoading: allLoading,
		error: allError,
	} = useClinics();

	const {
		data: nearbyClinics = [],
		isLoading: nearbyLoading,
		error: nearbyError,
	} = useClinicsNearby(
		userLocation?.lat ?? null,
		userLocation?.lng ?? null,
		radiusKm,
	);

	const isLoading = isNearbyMode ? nearbyLoading : allLoading;
	const error = isNearbyMode ? nearbyError : allError;

	const availableStates = useMemo(
		() =>
			[
				...new Set(allClinics.flatMap((c) => (c.state ? [c.state] : []))),
			].sort(),
		[allClinics],
	);

	const availableSpecialties = useMemo(
		() =>
			[
				...new Set(
					allClinics.flatMap((c) => c.members?.map((m) => m.specialty) ?? []),
				),
			].sort(),
		[allClinics],
	);

	const availableProfessions = useMemo(
		() =>
			[
				...new Set(
					allClinics.flatMap((c) => c.members?.map((m) => m.role) ?? []),
				),
			].sort(),
		[allClinics],
	);

	const baseList = isNearbyMode ? nearbyClinics : allClinics;

	const displayed = useMemo(() => {
		let result = baseList;

		if (search.trim())
			result = result.filter((c) =>
				c.name.toLowerCase().includes(search.toLowerCase()),
			);
		if (filterState) result = result.filter((c) => c.state === filterState);
		if (filterCity)
			result = result.filter((c) =>
				c.city?.toLowerCase().includes(filterCity.toLowerCase()),
			);
		if (filterSpecialty)
			result = result.filter((c) =>
				c.members?.some((m) => m.specialty === filterSpecialty),
			);
		if (filterProfession)
			result = result.filter((c) =>
				c.members?.some((m) => m.role === filterProfession),
			);

		return result;
	}, [
		baseList,
		search,
		filterState,
		filterCity,
		filterSpecialty,
		filterProfession,
	]);

	const advancedCount = [
		filterCity,
		filterSpecialty,
		filterProfession,
		selectedDays.length > 0,
	].filter(Boolean).length;
	const totalActive =
		[search, filterState].filter(Boolean).length + advancedCount;

	function clearFilters() {
		setSearch("");
		setFilterState("");
		setFilterCity("");
		setFilterSpecialty("");
		setFilterProfession("");
		setSelectedDays([]);
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

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			<PageHeader
				title="Clínicas"
				description="Encontre clínicas e centros médicos cadastrados na plataforma."
				icon={<Building2 className="h-6 w-6" />}
				count={displayed.length}
				countLabel="clínica"
			/>

			<ClinicsFilters
				search={search}
				onSearchChange={setSearch}
				filterState={filterState}
				onStateChange={setFilterState}
				filterCity={filterCity}
				onCityChange={setFilterCity}
				filterSpecialty={filterSpecialty}
				onSpecialtyChange={setFilterSpecialty}
				filterProfession={filterProfession}
				onProfessionChange={setFilterProfession}
				selectedDays={selectedDays}
				onDaysChange={setSelectedDays}
				availableStates={availableStates}
				availableSpecialties={availableSpecialties}
				availableProfessions={availableProfessions}
				totalActive={totalActive}
				advancedCount={advancedCount}
				expanded={expanded}
				onExpandedChange={setExpanded}
				isNearbyMode={isNearbyMode}
				radiusKm={radiusKm}
				onRadiusChange={setRadiusKm}
				locationLoading={locationLoading}
				onRequestLocation={requestLocation}
				onClearLocation={() => setUserLocation(null)}
				onClearFilters={clearFilters}
				viewMode={viewMode}
				onViewModeChange={setViewMode}
			/>

			{/* Content */}
			{viewMode === "map" ? (
				<div className="space-y-3">
					{displayed.filter((c) => c.latitude != null).length === 0 && (
						<p className="text-sm text-muted-foreground">
							Nenhuma clínica com localização encontrada para os filtros
							aplicados.
						</p>
					)}
					<ClinicsMap
						clinics={displayed}
						center={
							userLocation ? [userLocation.lat, userLocation.lng] : undefined
						}
						zoom={userLocation ? 10 : 5}
						className="h-[520px] w-full"
					/>
				</div>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{displayed.length === 0 && (
						<div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
								<Building2 className="h-6 w-6 text-muted-foreground" />
							</div>
							<h3 className="mt-4 text-sm font-semibold">
								Nenhuma clínica encontrada
							</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								Tente ajustar os filtros ou buscar por outro termo.
							</p>
							{totalActive > 0 && (
								<Button
									variant="outline"
									size="sm"
									className="mt-4"
									onClick={clearFilters}
								>
									Limpar filtros
								</Button>
							)}
						</div>
					)}
					{displayed.map((clinic) => (
						<ClinicCard key={clinic.id} clinic={clinic} />
					))}
				</div>
			)}
		</QueryBoundary>
	);
}
