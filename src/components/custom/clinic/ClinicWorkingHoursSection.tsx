"use client";

import { useClinicWorkingHours } from "@/features/schedule";
import { QueryBoundary } from "@/providers/query-boundary";
import { ClinicHoursEditor } from "./ClinicHoursEditor";
import type { ClinicWorkingHoursSectionProps } from "./ClinicWorkingHoursSection.types";

export function ClinicWorkingHoursSection({
	clinicId,
}: ClinicWorkingHoursSectionProps) {
	const {
		data: savedHours = [],
		isLoading,
		error,
	} = useClinicWorkingHours(clinicId);

	return (
		<div className="max-w-2xl space-y-4">
			<div>
				<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
					Horários de funcionamento
				</h3>
				<p className="text-xs text-muted-foreground mt-1">
					Configure os dias e horários em que a clínica está aberta.
				</p>
			</div>
			<QueryBoundary isLoading={isLoading} error={error}>
				<ClinicHoursEditor clinicId={clinicId} savedHours={savedHours} />
			</QueryBoundary>
		</div>
	);
}
