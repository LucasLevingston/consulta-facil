"use client";

import {
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
import type { UseClinicsFiltersReturn } from "@/hooks/use-clinics-filters";
import { cn } from "@/lib/utils/cn";
import { DAYS, type DayKey } from "@/utils/constants/days-of-week";
import { ALL } from "@/utils/constants/filter-sentinels";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";

interface Props {
	hook: UseClinicsFiltersReturn;
}

export function ClinicsFilters({ hook }: Props) {
	const { filterState: fs, location: loc, options, derived, actions } = hook;

	function toggleDay(day: DayKey) {
		if (fs.selectedDays.includes(day)) {
			actions.setSelectedDays(fs.selectedDays.filter((d) => d !== day));
		} else {
			actions.setSelectedDays([...fs.selectedDays, day]);
		}
	}

	return (
		<div className="space-y-3">
			{/* Row 1 */}
			<div className="flex flex-wrap items-center gap-2">
				<div className="relative min-w-[180px] flex-1 max-w-xs">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						id="clinics-search"
						placeholder="Buscar clínica..."
						value={fs.search}
						onChange={(e) => actions.setSearch(e.target.value)}
						className="pl-8 rounded-xl"
					/>
				</div>

				<Select
					value={fs.filterState || ALL}
					onValueChange={(v) => actions.setFilterState(v === ALL ? "" : v)}
				>
					<SelectTrigger className="w-[130px] rounded-xl">
						<div className="flex items-center gap-2">
							<MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
							<SelectValue placeholder="Estado" />
						</div>
					</SelectTrigger>
					<SelectContent className="rounded-xl">
						<SelectItem value={ALL}>Todos os estados</SelectItem>
						{options.availableStates.map((s) => (
							<SelectItem key={s} value={s}>
								{s}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Button
					variant="outline"
					size="sm"
					onClick={() => actions.setExpanded(!fs.expanded)}
					className="rounded-xl gap-2 shrink-0"
				>
					<SlidersHorizontal className="h-4 w-4" />
					Mais filtros
					{derived.advancedCount > 0 && (
						<Badge className="h-5 min-w-5 px-1.5 text-[10px] leading-none">
							{derived.advancedCount}
						</Badge>
					)}
					{fs.expanded ? (
						<ChevronUp className="h-3 w-3" />
					) : (
						<ChevronDown className="h-3 w-3" />
					)}
				</Button>

				{derived.totalActive > 0 && (
					<Button
						variant="ghost"
						size="sm"
						onClick={actions.clearFilters}
						className="gap-1.5 text-muted-foreground rounded-xl"
					>
						<X className="h-3.5 w-3.5" />
						Limpar ({derived.totalActive})
					</Button>
				)}

				{/* View + location */}
				<div className="ml-auto flex items-center gap-2">
					{derived.isNearbyMode ? (
						<div className="flex items-center gap-2">
							<Select
								value={String(loc.radiusKm)}
								onValueChange={(v) => actions.setRadiusKm(Number(v))}
							>
								<SelectTrigger className="h-9 w-[100px] rounded-xl text-sm">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="rounded-xl">
									{options.radiusOptions.map(({ value, label }) => (
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
								Perto de você ({loc.radiusKm}km)
								<button
									type="button"
									onClick={actions.clearLocation}
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
							onClick={actions.requestLocation}
							disabled={loc.locationLoading}
							className="rounded-xl gap-2"
						>
							{loc.locationLoading ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Navigation className="h-4 w-4" />
							)}
							Perto de mim
						</Button>
					)}

					<div className="flex rounded-xl border overflow-hidden">
						<Button
							variant={fs.viewMode === "list" ? "default" : "ghost"}
							size="sm"
							onClick={() => actions.setViewMode("list")}
							className="rounded-none"
						>
							<LayoutList className="h-4 w-4" />
						</Button>
						<Button
							variant={fs.viewMode === "map" ? "default" : "ghost"}
							size="sm"
							onClick={() => actions.setViewMode("map")}
							className="rounded-none"
						>
							<MapIcon className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>

			{/* Advanced filters */}
			{fs.expanded && (
				<div className="rounded-xl border border-border bg-muted/30 p-4 space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-200">
					<div className="flex flex-wrap gap-4">
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
									value={fs.filterCity}
									onChange={(e) => actions.setFilterCity(e.target.value)}
									className="pl-9 h-9 rounded-xl text-sm"
								/>
							</div>
						</div>

						<div className="w-[190px] space-y-1.5">
							<label
								htmlFor="filter-specialty-trigger"
								className="text-xs font-medium text-muted-foreground"
							>
								Especialidade
							</label>
							<Select
								value={fs.filterSpecialty || ALL}
								onValueChange={(v) =>
									actions.setFilterSpecialty(v === ALL ? "" : v)
								}
							>
								<SelectTrigger
									id="filter-specialty-trigger"
									className="h-9 rounded-xl text-sm"
								>
									<SelectValue placeholder="Todas" />
								</SelectTrigger>
								<SelectContent className="rounded-xl">
									<SelectItem value={ALL}>Todas as especialidades</SelectItem>
									{options.availableSpecialties.map((s) => (
										<SelectItem key={s} value={s}>
											{SPECIALTY_LABELS[s] ?? s}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{options.availableProfessions.length > 0 && (
							<div className="w-[175px] space-y-1.5">
								<label
									htmlFor="filter-profession-trigger"
									className="text-xs font-medium text-muted-foreground"
								>
									Tipo de profissional
								</label>
								<Select
									value={fs.filterProfession || ALL}
									onValueChange={(v) =>
										actions.setFilterProfession(v === ALL ? "" : v)
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
										{options.availableProfessions.map((p) => (
											<SelectItem key={p} value={p}>
												{p}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}
					</div>

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
										fs.selectedDays.includes(key)
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

			{/* Active chips */}
			{derived.totalActive > 0 && (
				<div className="flex flex-wrap gap-2">
					{fs.search && (
						<Badge
							variant="secondary"
							className="gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
						>
							<Search className="h-3 w-3" />
							&ldquo;{fs.search}&rdquo;
							<button
								type="button"
								onClick={() => actions.setSearch("")}
								className="ml-0.5 rounded-full hover:opacity-70 transition-opacity cursor-pointer"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}
					{fs.filterState && (
						<Badge
							variant="secondary"
							className="gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
						>
							<MapPin className="h-3 w-3" />
							{fs.filterState}
							<button
								type="button"
								onClick={() => actions.setFilterState("")}
								className="ml-0.5 rounded-full hover:opacity-70 transition-opacity cursor-pointer"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}
					{fs.filterCity && (
						<Badge
							variant="secondary"
							className="gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
						>
							<MapPin className="h-3 w-3" />
							{fs.filterCity}
							<button
								type="button"
								onClick={() => actions.setFilterCity("")}
								className="ml-0.5 rounded-full hover:opacity-70 transition-opacity cursor-pointer"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}
					{fs.filterSpecialty && (
						<Badge
							variant="secondary"
							className="gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
						>
							{fs.filterSpecialty}
							<button
								type="button"
								onClick={() => actions.setFilterSpecialty("")}
								className="ml-0.5 rounded-full hover:opacity-70 transition-opacity cursor-pointer"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}
					{fs.filterProfession && (
						<Badge
							variant="secondary"
							className="gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
						>
							{fs.filterProfession}
							<button
								type="button"
								onClick={() => actions.setFilterProfession("")}
								className="ml-0.5 rounded-full hover:opacity-70 transition-opacity cursor-pointer"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}
					{fs.selectedDays.map((day) => (
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
		</div>
	);
}
