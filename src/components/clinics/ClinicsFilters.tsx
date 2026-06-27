"use client";

import type { ClinicsFiltersProps } from "./ClinicsFilters.types";
import { ClinicsFiltersActiveChips } from "./ClinicsFiltersActiveChips";
import { ClinicsFiltersAdvancedPanel } from "./ClinicsFiltersAdvancedPanel";
import { ClinicsFiltersTopRow } from "./ClinicsFiltersTopRow";

export function ClinicsFilters({ hook }: ClinicsFiltersProps) {
	return (
		<div className="space-y-3">
			<ClinicsFiltersTopRow hook={hook} />
			{hook.filterState.expanded && <ClinicsFiltersAdvancedPanel hook={hook} />}
			{hook.derived.totalActive > 0 && (
				<ClinicsFiltersActiveChips hook={hook} />
			)}
		</div>
	);
}
