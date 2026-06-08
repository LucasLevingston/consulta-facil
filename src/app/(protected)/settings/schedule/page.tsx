import { Clock } from "lucide-react";

import PageHeader from "@/components/custom/page-header";
import { ScheduleContent } from "@/components/schedule/ScheduleContent";

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
