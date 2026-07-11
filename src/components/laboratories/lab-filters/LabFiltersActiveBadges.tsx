"use client";

import { MapPin, Search, X } from "lucide-react";
import type { UseLabFiltersReturn } from "@/app/laboratories/use-lab-filters";
import { Badge } from "@/components/ui/badge";

interface Props {
	hook: UseLabFiltersReturn;
}

export function LabFiltersActiveBadges({ hook }: Props) {
	const { filterState: fs, actions } = hook;
	return (
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
	);
}
