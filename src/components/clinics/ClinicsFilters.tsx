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
import { cn } from "@/lib/utils/cn";
import { DAYS, type DayKey } from "@/utils/constants/days-of-week";
import { ALL } from "@/utils/constants/filter-sentinels";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";
import { RADIUS_OPTIONS } from "@/utils/constants/radius-options";

interface ClinicsFiltersProps {
	search: string;
	onSearchChange: (v: string) => void;
	filterState: string;
	onStateChange: (v: string) => void;
	filterCity: string;
	onCityChange: (v: string) => void;
	filterSpecialty: string;
	onSpecialtyChange: (v: string) => void;
	filterProfession: string;
	onProfessionChange: (v: string) => void;
	selectedDays: DayKey[];
	onDaysChange: (days: DayKey[]) => void;
	availableStates: string[];
	availableSpecialties: string[];
	availableProfessions: string[];
	totalActive: number;
	advancedCount: number;
	expanded: boolean;
	onExpandedChange: (v: boolean) => void;
	isNearbyMode: boolean;
	radiusKm: number;
	onRadiusChange: (v: number) => void;
	locationLoading: boolean;
	onRequestLocation: () => void;
	onClearLocation: () => void;
	onClearFilters: () => void;
	viewMode: "list" | "map";
	onViewModeChange: (v: "list" | "map") => void;
}

export function ClinicsFilters({
	search,
	onSearchChange,
	filterState,
	onStateChange,
	filterCity,
	onCityChange,
	filterSpecialty,
	onSpecialtyChange,
	filterProfession,
	onProfessionChange,
	selectedDays,
	onDaysChange,
	availableStates,
	availableSpecialties,
	availableProfessions,
	totalActive,
	advancedCount,
	expanded,
	onExpandedChange,
	isNearbyMode,
	radiusKm,
	onRadiusChange,
	locationLoading,
	onRequestLocation,
	onClearLocation,
	onClearFilters,
	viewMode,
	onViewModeChange,
}: ClinicsFiltersProps) {
	function toggleDay(day: DayKey) {
		if (selectedDays.includes(day)) {
			onDaysChange(selectedDays.filter((d) => d !== day));
		} else {
			onDaysChange([...selectedDays, day]);
		}
	}

	return (
		<div className="space-y-3">
			{/* Filtros — linha 1 */}
			<div className="flex flex-wrap items-center gap-2">
				<div className="relative min-w-[180px] flex-1 max-w-xs">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						id="clinics-search"
						placeholder="Buscar clínica..."
						value={search}
						onChange={(e) => onSearchChange(e.target.value)}
						className="pl-8 rounded-xl"
					/>
				</div>

				<Select
					value={filterState || ALL}
					onValueChange={(v) => onStateChange(v === ALL ? "" : v)}
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
					onClick={() => onExpandedChange(!expanded)}
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
						onClick={onClearFilters}
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
								onValueChange={(v) => onRadiusChange(Number(v))}
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
									onClick={onClearLocation}
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
							onClick={onRequestLocation}
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
							onClick={() => onViewModeChange("list")}
							className="rounded-none"
						>
							<LayoutList className="h-4 w-4" />
						</Button>
						<Button
							variant={viewMode === "map" ? "default" : "ghost"}
							size="sm"
							onClick={() => onViewModeChange("map")}
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
									onChange={(e) => onCityChange(e.target.value)}
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
								onValueChange={(v) => onSpecialtyChange(v === ALL ? "" : v)}
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
											{SPECIALTY_LABELS[s] ?? s}
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
									onValueChange={(v) => onProfessionChange(v === ALL ? "" : v)}
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
								onClick={() => onSearchChange("")}
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
								onClick={() => onStateChange("")}
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
								onClick={() => onCityChange("")}
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
								onClick={() => onSpecialtyChange("")}
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
								onClick={() => onProfessionChange("")}
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
		</div>
	);
}
