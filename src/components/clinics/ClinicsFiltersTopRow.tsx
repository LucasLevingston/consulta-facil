"use client";

import {
	ChevronDown,
	ChevronUp,
	MapPin,
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
import { ClinicsLocationViewControls } from "./ClinicsLocationViewControls";

export function ClinicsFiltersTopRow({ hook }: ClinicsFiltersProps) {
	const { filterState: fs, options, derived, actions } = hook;

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

			<ClinicsLocationViewControls hook={hook} />
		</div>
	);
}
