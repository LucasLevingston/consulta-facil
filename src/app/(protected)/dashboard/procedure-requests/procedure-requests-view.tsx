"use client";

import { CalendarClock } from "lucide-react";
import { usePermission } from "@/components/auth/hooks";
import PageHeader from "@/components/custom/page-header";
import { ProcedureRequestsContent } from "@/components/procedure-requests/procedure-requests-content";

export function ProcedureRequestsView() {
	const { can } = usePermission();
	const isProfessional = can("procedure:manage");

	return (
		<div className="space-y-6">
			<PageHeader
				title="Solicitações de Procedimento"
				description={
					isProfessional
						? "Gerencie solicitações de procedimentos para seus pacientes."
						: "Veja e agende os procedimentos solicitados pelo seu profissional."
				}
				icon={<CalendarClock className="h-6 w-6" />}
			/>
			<ProcedureRequestsContent isProfessional={isProfessional} />
		</div>
	);
}
