"use client";

import { useClinicWorkingHours } from "@/hooks/api/schedule/use-clinic-working-hours";
import { QueryBoundary } from "@/providers/query-boundary";
import { ClinicHoursEditor } from "./ClinicHoursEditor";

export function ClinicWorkingHoursSection({ clinicId }: { clinicId: string }) {
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
