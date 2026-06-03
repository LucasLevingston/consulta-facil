"use client";

import {
	Building2,
	ChevronDown,
	ChevronUp,
	LayoutList,
	Loader2,
	MapIcon,
	MapPin,
	Navigation,
	Search,
	SlidersHorizontal,
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
import { cn } from "@/lib/utils";
import { QueryBoundary } from "@/providers/query-boundary";

type ViewMode = "list" | "map";
const ALL = "__all__";

const DAYS = [
	{ key: "MONDAY", label: "Seg" },
	{ key: "TUESDAY", label: "Ter" },
	{ key: "WEDNESDAY", label: "Qua" },
	{ key: "THURSDAY", label: "Qui" },
	{ key: "FRIDAY", label: "Sex" },
	{ key: "SATURDAY", label: "Sáb" },
	{ key: "SUNDAY", label: "Dom" },
] as const;

type DayKey = (typeof DAYS)[number]["key"];

const RADIUS_OPTIONS = [
	{ value: "10", label: "10 km" },
	{ value: "25", label: "25 km" },
	{ value: "50", label: "50 km" },
	{ value: "100", label: "100 km" },
] as const;

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

	function toggleDay(day: DayKey) {
		setSelectedDays((prev) =>
			prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
		);
	}

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

	function clearLocation() {
		setUserLocation(null);
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
				{/* Filtros — linha 1 */}
				<div className="flex flex-wrap items-center gap-2">
					<div className="relative min-w-[180px] flex-1 max-w-xs">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							id="clinics-search"
							placeholder="Buscar clínica..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-8 rounded-xl"
						/>
					</div>

					<Select
						value={filterState || ALL}
						onValueChange={(v) => setFilterState(v === ALL ? "" : v)}
					>
						<SelectTrigger className="w-[130px] rounded-xl">
							<div className="flex items-center gap-2">
								<MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
								<SelectValue placeholder="Estado" />
							</div>
						</SelectTrigger>
						<SelectContent className="rounded-xl">
							<SelectItem value={ALL}>Todos os estados</SelectItem>
							{availableStates.map((s) => (
								<SelectItem key={s} value={s}>
									{s}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Button
						variant="outline"
						size="sm"
						onClick={() => setExpanded((v) => !v)}
						className="rounded-xl gap-2 shrink-0"
					>
						<SlidersHorizontal className="h-4 w-4" />
						Mais filtros
						{advancedCount > 0 && (
							<Badge className="h-5 min-w-5 px-1.5 text-[10px] leading-none">
								{advancedCount}
							</Badge>
						)}
						{expanded ? (
							<ChevronUp className="h-3 w-3" />
						) : (
							<ChevronDown className="h-3 w-3" />
						)}
					</Button>

					{totalActive > 0 && (
						<Button
							variant="ghost"
							size="sm"
							onClick={clearFilters}
							className="gap-1.5 text-muted-foreground rounded-xl"
						>
							<X className="h-3.5 w-3.5" />
							Limpar ({totalActive})
						</Button>
					)}

					{/* View + location controls */}
					<div className="ml-auto flex items-center gap-2">
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
									Perto de você ({radiusKm}km)
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

				{/* Filtros avançados colapsíveis */}
				{expanded && (
					<div className="rounded-xl border border-border bg-muted/30 p-4 space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-200">
						<div className="flex flex-wrap gap-4">
							{/* Cidade */}
							<div className="flex-1 min-w-[180px] max-w-xs space-y-1.5">
								<label
									htmlFor="filter-city"
									className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"
								>
									<MapPin className="h-3.5 w-3.5" />
									Cidade
								</label>
								<div className="relative">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
									<Input
										id="filter-city"
										placeholder="Ex: São Paulo, Campinas..."
										value={filterCity}
										onChange={(e) => setFilterCity(e.target.value)}
										className="pl-9 h-9 rounded-xl text-sm"
									/>
								</div>
							</div>

							{/* Especialidade */}
							<div className="w-[190px] space-y-1.5">
								<label
									htmlFor="filter-specialty-trigger"
									className="text-xs font-medium text-muted-foreground"
								>
									Especialidade
								</label>
								<Select
									value={filterSpecialty || ALL}
									onValueChange={(v) => setFilterSpecialty(v === ALL ? "" : v)}
								>
									<SelectTrigger
										id="filter-specialty-trigger"
										className="h-9 rounded-xl text-sm"
									>
										<SelectValue placeholder="Todas" />
									</SelectTrigger>
									<SelectContent className="rounded-xl">
										<SelectItem value={ALL}>Todas as especialidades</SelectItem>
										{availableSpecialties.map((s) => (
											<SelectItem key={s} value={s}>
												{s}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Profissão */}
							{availableProfessions.length > 0 && (
								<div className="w-[175px] space-y-1.5">
									<label
										htmlFor="filter-profession-trigger"
										className="text-xs font-medium text-muted-foreground"
									>
										Tipo de profissional
									</label>
									<Select
										value={filterProfession || ALL}
										onValueChange={(v) =>
											setFilterProfession(v === ALL ? "" : v)
										}
									>
										<SelectTrigger
											id="filter-profession-trigger"
											className="h-9 rounded-xl text-sm"
										>
											<SelectValue placeholder="Todos" />
										</SelectTrigger>
										<SelectContent className="rounded-xl">
											<SelectItem value={ALL}>Todos os tipos</SelectItem>
											{availableProfessions.map((p) => (
												<SelectItem key={p} value={p}>
													{p}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							)}
						</div>

						{/* Horário de funcionamento — day chips */}
						<div className="space-y-1.5">
							<span className="text-xs font-medium text-muted-foreground">
								Horário de funcionamento
							</span>
							<div className="flex flex-wrap gap-1.5">
								{DAYS.map(({ key, label }) => (
									<button
										key={key}
										type="button"
										onClick={() => toggleDay(key)}
										className={cn(
											"px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer",
											selectedDays.includes(key)
												? "bg-primary text-primary-foreground border-primary"
												: "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground",
										)}
									>
										{label}
									</button>
								))}
							</div>
						</div>
					</div>
				)}

				{/* Active filter badges */}
				{totalActive > 0 && (
					<div className="flex flex-wrap gap-2">
						{search && (
							<Badge
								variant="secondary"
								className="gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
							>
								<Search className="h-3 w-3" />
								&ldquo;{search}&rdquo;
								<button
									type="button"
									onClick={() => setSearch("")}
									className="ml-0.5 rounded-full hover:opacity-70 transition-opacity cursor-pointer"
								>
									<X className="h-3 w-3" />
								</button>
							</Badge>
						)}
						{filterState && (
							<Badge
								variant="secondary"
								className="gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
							>
								<MapPin className="h-3 w-3" />
								{filterState}
								<button
									type="button"
									onClick={() => setFilterState("")}
									className="ml-0.5 rounded-full hover:opacity-70 transition-opacity cursor-pointer"
								>
									<X className="h-3 w-3" />
								</button>
							</Badge>
						)}
						{filterCity && (
							<Badge
								variant="secondary"
								className="gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
							>
								<MapPin className="h-3 w-3" />
								{filterCity}
								<button
									type="button"
									onClick={() => setFilterCity("")}
									className="ml-0.5 rounded-full hover:opacity-70 transition-opacity cursor-pointer"
								>
									<X className="h-3 w-3" />
								</button>
							</Badge>
						)}
						{filterSpecialty && (
							<Badge
								variant="secondary"
								className="gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
							>
								{filterSpecialty}
								<button
									type="button"
									onClick={() => setFilterSpecialty("")}
									className="ml-0.5 rounded-full hover:opacity-70 transition-opacity cursor-pointer"
								>
									<X className="h-3 w-3" />
								</button>
							</Badge>
						)}
						{filterProfession && (
							<Badge
								variant="secondary"
								className="gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
							>
								{filterProfession}
								<button
									type="button"
									onClick={() => setFilterProfession("")}
									className="ml-0.5 rounded-full hover:opacity-70 transition-opacity cursor-pointer"
								>
									<X className="h-3 w-3" />
								</button>
							</Badge>
						)}
						{selectedDays.map((day) => (
							<Badge
								key={day}
								variant="secondary"
								className="gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
							>
								{DAYS.find((d) => d.key === day)?.label ?? day}
								<button
									type="button"
									onClick={() => toggleDay(day)}
									className="ml-0.5 rounded-full hover:opacity-70 transition-opacity cursor-pointer"
								>
									<X className="h-3 w-3" />
								</button>
							</Badge>
						))}
					</div>
				)}

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
			</div>
		</QueryBoundary>
	);
}
