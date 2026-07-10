"use client";

import type { LabFiltersProps } from "./LabFilters.types";
import { LabFiltersActiveBadges } from "./LabFiltersActiveBadges";
import { LabFiltersAdvancedPanel } from "./LabFiltersAdvancedPanel";
import { LabFiltersLocationControl } from "./LabFiltersLocationControl";
import { LabFiltersSearchRow } from "./LabFiltersSearchRow";

export function LabFilters({ hook }: LabFiltersProps) {
	const { filterState: fs, derived } = hook;
	return (
		<div className="space-y-3">
			<div className="flex flex-wrap items-center gap-2">
				<LabFiltersSearchRow hook={hook} />
				<LabFiltersLocationControl hook={hook} />
			</div>
			{fs.expanded && <LabFiltersAdvancedPanel hook={hook} />}
			{derived.totalActive > 0 && <LabFiltersActiveBadges hook={hook} />}
		</div>
	);
}
