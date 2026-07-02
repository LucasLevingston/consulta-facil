"use client";

import { MapPin, Search } from "lucide-react";
import { DAYS } from "@/utils/constants/days-of-week";
import type { ClinicsFiltersProps } from "./ClinicsFilters.types";
import { FilterChip } from "./FilterChip";

export function ClinicsFiltersActiveChips({ hook }: ClinicsFiltersProps) {
	const { filterState: fs, actions } = hook;

	function removeDay(day: (typeof fs.selectedDays)[number]) {
		actions.setSelectedDays(fs.selectedDays.filter((d) => d !== day));
	}

	return (
		<div className="flex flex-wrap gap-2">
			{fs.search && (
				<FilterChip
					icon={<Search className="h-3 w-3" />}
					label={<>&ldquo;{fs.search}&rdquo;</>}
					onRemove={() => actions.setSearch("")}
				/>
			)}
			{fs.filterState && (
				<FilterChip
					icon={<MapPin className="h-3 w-3" />}
					label={fs.filterState}
					onRemove={() => actions.setFilterState("")}
				/>
			)}
			{fs.filterCity && (
				<FilterChip
					icon={<MapPin className="h-3 w-3" />}
					label={fs.filterCity}
					onRemove={() => actions.setFilterCity("")}
				/>
			)}
			{fs.filterSpecialty && (
				<FilterChip
					label={fs.filterSpecialty}
					onRemove={() => actions.setFilterSpecialty("")}
				/>
			)}
			{fs.filterProfession && (
				<FilterChip
					label={fs.filterProfession}
					onRemove={() => actions.setFilterProfession("")}
				/>
			)}
			{fs.selectedDays.map((day) => (
				<FilterChip
					key={day}
					label={DAYS.find((d) => d.key === day)?.label ?? day}
					onRemove={() => removeDay(day)}
				/>
			))}
		</div>
	);
}
