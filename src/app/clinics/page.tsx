"use client";

import {
	Building2,
	LayoutList,
	Loader2,
	MapIcon,
	Navigation,
	Search,
	X,
} from "lucide-react";
import { useMemo, useState } from "react";

import ClinicCard from "@/components/custom/clinic/ClinicCard";
import { ClinicsMap } from "@/components/custom/map/ClinicsMap";
import PageHeader from "@/components/custom/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useClinics, useClinicsNearby } from "@/hooks/api/use-clinics";
import { QueryBoundary } from "@/providers/query-boundary";

type ViewMode = "list" | "map";
const ALL = "__all__";

export default function ClinicsPage() {
	const [viewMode, setViewMode] = useState<ViewMode>("list");
	const [userLocation, setUserLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [locationLoading, setLocationLoading] = useState(false);
	const [search, setSearch] = useState("");
	const [filterState, setFilterState] = useState("");
	const [filterSpecialty, setFilterSpecialty] = useState("");
	const radiusKm = 50;

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

	const baseList = isNearbyMode ? nearbyClinics : allClinics;
	const displayed = useMemo(() => {
		let result = baseList;
		if (search.trim())
			result = result.filter((c) =>
				c.name.toLowerCase().includes(search.toLowerCase()),
			);
		if (filterState) result = result.filter((c) => c.state === filterState);
		if (filterSpecialty)
			result = result.filter((c) =>
				c.members?.some((m) => m.specialty === filterSpecialty),
			);
		return result;
	}, [baseList, search, filterState, filterSpecialty]);

	const hasActiveFilters = search.trim() || filterState || filterSpecialty;

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

	function clearFilters() {
		setSearch("");
		setFilterState("");
		setFilterSpecialty("");
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

			<div className="space-y-3">
				{/* Filters row */}
				<div className="flex flex-wrap items-center gap-2">
					<div className="relative min-w-[180px] flex-1 max-w-xs">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Buscar clínica..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-8"
						/>
					</div>

					<Select
						value={filterState || ALL}
						onValueChange={(v) => setFilterState(v === ALL ? "" : v)}
					>
						<SelectTrigger className="w-[140px]">
							<SelectValue placeholder="Estado" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={ALL}>Todos os estados</SelectItem>
							{availableStates.map((s) => (
								<SelectItem key={s} value={s}>
									{s}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						value={filterSpecialty || ALL}
						onValueChange={(v) => setFilterSpecialty(v === ALL ? "" : v)}
					>
						<SelectTrigger className="w-[170px]">
							<SelectValue placeholder="Especialidade" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={ALL}>Todas as especialidades</SelectItem>
							{availableSpecialties.map((s) => (
								<SelectItem key={s} value={s}>
									{s}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{hasActiveFilters && (
						<Button
							variant="ghost"
							size="sm"
							onClick={clearFilters}
							className="gap-1.5"
						>
							<X className="h-3.5 w-3.5" />
							Limpar filtros
						</Button>
					)}

					{/* View controls */}
					<div className="ml-auto flex items-center gap-2">
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
								{hasActiveFilters && (
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
			</div>
		</QueryBoundary>
	);
}
