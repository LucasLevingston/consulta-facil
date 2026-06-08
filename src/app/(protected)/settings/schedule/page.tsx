"use client";

import { Clock } from "lucide-react";

import PageHeader from "@/components/custom/page-header";
import { ScheduleEditor } from "@/components/schedule/ScheduleEditor";
import { useMySchedule } from "@/hooks/api/schedule/use-my-schedule";
import { usePermission } from "@/hooks/use-permission";
import { QueryBoundary } from "@/providers/query-boundary";

function ScheduleContent() {
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

export default function SchedulePage() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Horários de Atendimento"
				description="Configure seus dias e horários disponíveis para consultas."
				icon={<Clock className="h-6 w-6" />}
			/>
			<ScheduleContent />
		</div>
	);
}
