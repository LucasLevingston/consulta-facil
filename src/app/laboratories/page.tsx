"use client";

import { FlaskConical } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import PageHeader from "@/components/custom/page-header";
import { LabCard } from "@/components/laboratories/LabCard";
import { LabFilters } from "@/components/laboratories/LabFilters";
import { Button } from "@/components/ui/button";
import { useExamLabs } from "@/hooks/api/exam-labs/use-exam-labs";
import { useExamLabsNearby } from "@/hooks/api/exam-labs/use-exam-labs-nearby";
import { QueryBoundary } from "@/providers/query-boundary";

function LaboratoriesPageContent() {
	const searchParams = useSearchParams();
	const examRequestId = searchParams.get("examId");

	const [search, setSearch] = useState("");
	const [filterState, setFilterState] = useState("");
	const [filterCity, setFilterCity] = useState("");
	const [userLocation, setUserLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [locationLoading, setLocationLoading] = useState(false);
	const [radiusKm, setRadiusKm] = useState(50);
	const [expanded, setExpanded] = useState(false);

	const isNearbyMode = userLocation !== null;

	const {
		data: allLabs = [],
		isLoading: allLoading,
		error: allError,
	} = useExamLabs();
	const {
		data: nearbyLabs = [],
		isLoading: nearbyLoading,
		error: nearbyError,
	} = useExamLabsNearby(
		userLocation?.lat ?? null,
		userLocation?.lng ?? null,
		radiusKm,
	);

	const isLoading = isNearbyMode ? nearbyLoading : allLoading;
	const error = isNearbyMode ? nearbyError : allError;

	const availableStates = useMemo(
		() =>
			[...new Set(allLabs.flatMap((l) => (l.state ? [l.state] : [])))].sort(),
		[allLabs],
	);

	const baseList = isNearbyMode ? nearbyLabs : allLabs;

	const displayed = useMemo(() => {
		let result = baseList;
		if (search.trim())
			result = result.filter(
				(l) =>
					l.name.toLowerCase().includes(search.toLowerCase()) ||
					l.acceptedExams?.some((e) =>
						e.toLowerCase().includes(search.toLowerCase()),
					),
			);
		if (filterState) result = result.filter((l) => l.state === filterState);
		if (filterCity)
			result = result.filter((l) =>
				l.city?.toLowerCase().includes(filterCity.toLowerCase()),
			);
		return result;
	}, [baseList, search, filterState, filterCity]);

	const totalActive = [search, filterState, filterCity].filter(Boolean).length;
	const advancedCount = [filterCity].filter(Boolean).length;

	function clearFilters() {
		setSearch("");
		setFilterState("");
		setFilterCity("");
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
				setLocationLoading(false);
			},
			() => setLocationLoading(false),
		);
	}

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			<PageHeader
				title="Laboratórios de Exames"
				description={
					examRequestId
						? "Selecione um laboratório para agendar seu exame."
						: "Encontre laboratórios para realizar seus exames."
				}
				icon={<FlaskConical className="h-6 w-6" />}
				count={displayed.length}
				countLabel="laboratório"
			/>

			{examRequestId && (
				<div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 mb-1">
					<FlaskConical className="h-4 w-4 text-primary shrink-0" />
					<p className="text-sm text-primary">
						Escolha um laboratório e clique em <strong>Agendar aqui</strong>{" "}
						para marcar seu exame.
					</p>
				</div>
			)}

			<LabFilters
				search={search}
				onSearchChange={setSearch}
				filterState={filterState}
				onStateChange={setFilterState}
				filterCity={filterCity}
				onCityChange={setFilterCity}
				availableStates={availableStates}
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
			/>

			{displayed.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
						<FlaskConical className="h-6 w-6 text-muted-foreground" />
					</div>
					<h3 className="mt-4 text-sm font-semibold">
						Nenhum laboratório encontrado
					</h3>
					<p className="mt-2 text-sm text-muted-foreground">
						Tente ajustar os filtros ou buscar por outro exame.
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
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{displayed.map((lab) => (
						<LabCard key={lab.id} lab={lab} examRequestId={examRequestId} />
					))}
				</div>
			)}
		</QueryBoundary>
	);
}

export default function LaboratoriesPage() {
	return (
		<Suspense>
			<LaboratoriesPageContent />
		</Suspense>
	);
}
