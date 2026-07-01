"use client";

import {
	ChevronDown,
	ChevronUp,
	Search,
	SlidersHorizontal,
	X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DoctorFiltersSelects } from "./DoctorFiltersSelects";
import type { useDoctorFilters } from "./useDoctorFilters";

interface Props {
	filters: ReturnType<typeof useDoctorFilters>;
}

export function DoctorFiltersBasicRow({ filters }: Props) {
	return (
		<div className="flex flex-wrap gap-2 items-center">
			<div className="relative flex-1 min-w-[180px] max-w-xs">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
				<Input
					id="filter-name"
					placeholder="Buscar por nome..."
					value={filters.name}
					onChange={(e) => filters.setName(e.target.value)}
					className="pl-9 rounded-xl"
				/>
			</div>
			<DoctorFiltersSelects filters={filters} />
			<Button
				variant="outline"
				size="sm"
				onClick={() => filters.setExpanded((v) => !v)}
				className="rounded-xl gap-2 shrink-0"
			>
				<SlidersHorizontal className="h-4 w-4" />
				Mais filtros
				{filters.advancedCount > 0 && (
					<Badge className="h-5 min-w-5 px-1.5 text-[10px] leading-none">
						{filters.advancedCount}
					</Badge>
				)}
				{filters.expanded ? (
					<ChevronUp className="h-3 w-3" />
				) : (
					<ChevronDown className="h-3 w-3" />
				)}
			</Button>
			{filters.totalActive > 0 && (
				<Button
					variant="ghost"
					size="sm"
					onClick={filters.clearAll}
					className="text-muted-foreground gap-1.5 rounded-xl"
				>
					<X className="h-3.5 w-3.5" />
					Limpar ({filters.totalActive})
				</Button>
			)}
		</div>
	);
}
