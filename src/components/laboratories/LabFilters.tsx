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
import type { LabFiltersProps } from "./LabFilters.types";

export function LabFilters({ hook }: LabFiltersProps) {
	const { filterState: fs, location: loc, options, derived, actions } = hook;

	return (
		<div className="space-y-3">
			<div className="flex flex-wrap items-center gap-2">
				<div className="relative min-w-[180px] flex-1 max-w-xs">
					<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
					<Input
						placeholder="Buscar por laboratório ou exame..."
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
									aria-label="Remover localização"
									onClick={actions.clearLocation}
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
				</div>
			</div>

			{fs.expanded && (
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
								value={fs.filterCity}
								onChange={(e) => actions.setFilterCity(e.target.value)}
								className="pl-9 h-9 rounded-xl text-sm"
							/>
						</div>
					</div>
				</div>
			)}

			{derived.totalActive > 0 && (
				<div className="flex flex-wrap gap-2">
					{fs.search && (
						<Badge
							variant="secondary"
							className="gap-1.5 px-3 py-1 rounded-full text-xs"
						>
							<Search className="h-3 w-3" />
							&ldquo;{fs.search}&rdquo;
							<button
								type="button"
								aria-label="Remover busca"
								onClick={() => actions.setSearch("")}
								className="ml-0.5 hover:opacity-70 transition-opacity cursor-pointer"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}
					{fs.filterState && (
						<Badge
							variant="secondary"
							className="gap-1.5 px-3 py-1 rounded-full text-xs"
						>
							<MapPin className="h-3 w-3" />
							{fs.filterState}
							<button
								type="button"
								aria-label="Remover filtro de estado"
								onClick={() => actions.setFilterState("")}
								className="ml-0.5 hover:opacity-70 transition-opacity cursor-pointer"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}
					{fs.filterCity && (
						<Badge
							variant="secondary"
							className="gap-1.5 px-3 py-1 rounded-full text-xs"
						>
							<MapPin className="h-3 w-3" />
							{fs.filterCity}
							<button
								type="button"
								aria-label="Remover filtro de cidade"
								onClick={() => actions.setFilterCity("")}
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
