"use client";

import { ScheduleEditor } from "@/components/schedule/ScheduleEditor";
import { usePermission } from "@/features/auth";
import { useMySchedule } from "@/features/schedule";
import { QueryBoundary } from "@/providers/query-boundary";

export function ScheduleContent() {
	const { can } = usePermission();
	const isProfessional = can("schedule:manage");
	const {
		data: schedule = [],
		isLoading,
		error,
	} = useMySchedule(isProfessional);

	if (!isProfessional) {
		return (
			<p className="text-sm text-muted-foreground">
				Apenas profissionais podem configurar horários de atendimento.
			</p>
		);
	}

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			<ScheduleEditor savedSchedule={schedule} />
		</QueryBoundary>
	);
}
