"use client";

import { ProfessionalFiltersActiveBadges } from "./ProfessionalFiltersActiveBadges";
import { ProfessionalFiltersAdvanced } from "./ProfessionalFiltersAdvanced";
import { ProfessionalFiltersBasicRow } from "./ProfessionalFiltersBasicRow";
import { useProfessionalFilters } from "./useProfessionalFilters";

export default function ProfessionalFilters() {
	const filters = useProfessionalFilters();
	return (
		<div className="space-y-3 w-full">
			<ProfessionalFiltersBasicRow filters={filters} />
			{filters.expanded && <ProfessionalFiltersAdvanced filters={filters} />}
			{filters.totalActive > 0 && (
				<ProfessionalFiltersActiveBadges filters={filters} />
			)}
		</div>
	);
}
