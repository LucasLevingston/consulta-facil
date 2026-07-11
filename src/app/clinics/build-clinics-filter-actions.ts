import type { Dispatch, SetStateAction } from "react";
import type { DayKey } from "@/utils/constants/days-of-week";
import type { ClinicsViewMode } from "./ClinicsViewMode.types";

interface BuildClinicsFilterActionsParams {
	setSearch: Dispatch<SetStateAction<string>>;
	setFilterState: Dispatch<SetStateAction<string>>;
	setFilterCity: Dispatch<SetStateAction<string>>;
	setFilterSpecialty: Dispatch<SetStateAction<string>>;
	setFilterProfession: Dispatch<SetStateAction<string>>;
	setSelectedDays: Dispatch<SetStateAction<DayKey[]>>;
	setExpanded: Dispatch<SetStateAction<boolean>>;
	setViewMode: Dispatch<SetStateAction<ClinicsViewMode>>;
	setRadiusKm: (v: number) => void;
	requestLocation: (onDone: () => void) => void;
	clearLocation: () => void;
}

export function buildClinicsFilterActions(
	params: BuildClinicsFilterActionsParams,
) {
	return {
		setSearch: params.setSearch,
		setFilterState: params.setFilterState,
		setFilterCity: params.setFilterCity,
		setFilterSpecialty: params.setFilterSpecialty,
		setFilterProfession: params.setFilterProfession,
		setSelectedDays: params.setSelectedDays,
		setExpanded: params.setExpanded,
		setViewMode: params.setViewMode,
		setRadiusKm: params.setRadiusKm,
		clearFilters: () => {
			params.setSearch("");
			params.setFilterState("");
			params.setFilterCity("");
			params.setFilterSpecialty("");
			params.setFilterProfession("");
			params.setSelectedDays([]);
		},
		requestLocation: () =>
			params.requestLocation(() => params.setViewMode("map")),
		clearLocation: params.clearLocation,
	};
}
