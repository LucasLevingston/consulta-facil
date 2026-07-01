"use client";

import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { DayKey } from "@/utils/constants/days-of-week";
import type { ClinicsFiltersProps } from "./ClinicsFilters.types";
import { ClinicsFiltersDayPicker } from "./ClinicsFiltersDayPicker";
import { ClinicsFiltersSelectsRow } from "./ClinicsFiltersSelectsRow";

export function ClinicsFiltersAdvancedPanel({ hook }: ClinicsFiltersProps) {
	const { filterState: fs, options, actions } = hook;

	function toggleDay(day: DayKey) {
		if (fs.selectedDays.includes(day)) {
			actions.setSelectedDays(fs.selectedDays.filter((d) => d !== day));
		} else {
			actions.setSelectedDays([...fs.selectedDays, day]);
		}
	}

	return (
		<div className="rounded-xl border border-border bg-muted/30 p-4 space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-200">
			<div className="flex flex-wrap gap-4">
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
							value={fs.filterCity}
							onChange={(e) => actions.setFilterCity(e.target.value)}
							className="pl-9 h-9 rounded-xl text-sm"
						/>
					</div>
				</div>
				<ClinicsFiltersSelectsRow
					filterSpecialty={fs.filterSpecialty}
					filterProfession={fs.filterProfession}
					availableSpecialties={options.availableSpecialties}
					availableProfessions={options.availableProfessions}
					onSpecialtyChange={actions.setFilterSpecialty}
					onProfessionChange={actions.setFilterProfession}
				/>
			</div>
			<ClinicsFiltersDayPicker
				selectedDays={fs.selectedDays}
				onToggle={toggleDay}
			/>
		</div>
	);
}
