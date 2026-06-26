"use client";

import {
	ChevronDown,
	ChevronUp,
	Loader2,
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
import { ALL } from "@/utils/constants/filter-sentinels";
import { RADIUS_OPTIONS } from "@/utils/constants/radius-options";

interface LabFiltersProps {
	search: string;
	onSearchChange: (v: string) => void;
	filterState: string;
	onStateChange: (v: string) => void;
	filterCity: string;
	onCityChange: (v: string) => void;
	availableStates: string[];
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
}

export function LabFilters({
	search,
	onSearchChange,
	filterState,
	onStateChange,
	filterCity,
	onCityChange,
	availableStates,
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
}: LabFiltersProps) {
	return (
		<div className="space-y-3">
			{/* Filter row */}
			<div className="flex flex-wrap items-center gap-2">
				<div className="relative min-w-[180px] flex-1 max-w-xs">
					<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
					<Input
						placeholder="Buscar por laboratório ou exame..."
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

				{/* Nearby toggle */}
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
									aria-label="Remover localização"
									onClick={onClearLocation}
									className="ml-0.5 hover:opacity-70 transition-opacity cursor-pointer"
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
				</div>
			</div>

			{/* Advanced filters */}
			{expanded && (
				<div className="rounded-xl border border-border bg-muted/30 p-4 animate-in fade-in-0 slide-in-from-top-2 duration-200">
					<div className="max-w-xs space-y-1.5">
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
								placeholder="Ex: João Pessoa, Campina Grande..."
								value={filterCity}
								onChange={(e) => onCityChange(e.target.value)}
								className="pl-9 h-9 rounded-xl text-sm"
							/>
						</div>
					</div>
				</div>
			)}

			{/* Active filter chips */}
			{totalActive > 0 && (
				<div className="flex flex-wrap gap-2">
					{search && (
						<Badge
							variant="secondary"
							className="gap-1.5 px-3 py-1 rounded-full text-xs"
						>
							<Search className="h-3 w-3" />
							&ldquo;{search}&rdquo;
							<button
								type="button"
								aria-label="Remover busca"
								onClick={() => onSearchChange("")}
								className="ml-0.5 hover:opacity-70 transition-opacity cursor-pointer"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}
					{filterState && (
						<Badge
							variant="secondary"
							className="gap-1.5 px-3 py-1 rounded-full text-xs"
						>
							<MapPin className="h-3 w-3" />
							{filterState}
							<button
								type="button"
								aria-label="Remover filtro de estado"
								onClick={() => onStateChange("")}
								className="ml-0.5 hover:opacity-70 transition-opacity cursor-pointer"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}
					{filterCity && (
						<Badge
							variant="secondary"
							className="gap-1.5 px-3 py-1 rounded-full text-xs"
						>
							<MapPin className="h-3 w-3" />
							{filterCity}
							<button
								type="button"
								aria-label="Remover filtro de cidade"
								onClick={() => onCityChange("")}
								className="ml-0.5 hover:opacity-70 transition-opacity cursor-pointer"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}
				</div>
			)}
		</div>
	);
}
