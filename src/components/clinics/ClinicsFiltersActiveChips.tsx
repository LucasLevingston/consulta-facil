"use client";

import { MapPin, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DAYS } from "@/utils/constants/days-of-week";
import type { ClinicsFiltersProps } from "./ClinicsFilters.types";

export function ClinicsFiltersActiveChips({ hook }: ClinicsFiltersProps) {
	const { filterState: fs, actions } = hook;

	function removeDay(day: (typeof fs.selectedDays)[number]) {
		actions.setSelectedDays(fs.selectedDays.filter((d) => d !== day));
	}

	return (
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
						onClick={() => removeDay(day)}
						className="ml-0.5 rounded-full hover:opacity-70 transition-opacity cursor-pointer"
					>
						<X className="h-3 w-3" />
					</button>
				</Badge>
			))}
		</div>
	);
}
