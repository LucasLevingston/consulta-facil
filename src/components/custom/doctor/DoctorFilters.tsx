"use client";

import { DoctorFiltersActiveBadges } from "./DoctorFiltersActiveBadges";
import { DoctorFiltersAdvanced } from "./DoctorFiltersAdvanced";
import { DoctorFiltersBasicRow } from "./DoctorFiltersBasicRow";
import { useDoctorFilters } from "./useDoctorFilters";

export default function DoctorFilters() {
	const filters = useDoctorFilters();
	return (
		<div className="space-y-3 w-full">
			<DoctorFiltersBasicRow filters={filters} />
			{filters.expanded && <DoctorFiltersAdvanced filters={filters} />}
			{filters.totalActive > 0 && (
				<DoctorFiltersActiveBadges filters={filters} />
			)}
		</div>
	);
}
