"use client";

import { MapPin, Search } from "lucide-react";
import type { UseLabFiltersReturn } from "@/app/laboratories/use-lab-filters";
import { Input } from "@/components/ui/input";

interface Props {
	hook: UseLabFiltersReturn;
}

export function LabFiltersAdvancedPanel({ hook }: Props) {
	const { filterState: fs, actions } = hook;
	return (
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
	);
}
