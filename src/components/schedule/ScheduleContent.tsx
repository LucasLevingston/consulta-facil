"use client";

import { usePermission } from "@/components/auth/hooks";
import { ScheduleEditor } from "@/components/schedule/ScheduleEditor";
import { QueryBoundary } from "@/providers/query-boundary";
import { useMySchedule } from "./use-my-schedule";

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
