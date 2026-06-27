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
import { ALL } from "@/utils/constants/filter-sentinels";
import type { ClinicsFiltersProps } from "./ClinicsFilters.types";

export function ClinicsFiltersTopRow({ hook }: ClinicsFiltersProps) {
	const { filterState: fs, location: loc, options, derived, actions } = hook;

	return (
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
	);
}
