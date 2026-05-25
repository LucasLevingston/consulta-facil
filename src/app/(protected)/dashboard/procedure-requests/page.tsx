"use client";

import { CalendarClock } from "lucide-react";
import PageHeader from "@/components/custom/page-header";
import { useUserStore } from "@/store/useUserStore";
import { ProcedureRequestsContent } from "./_components/ProcedureRequestsContent";

export default function ProcedureRequestsPage() {
	const { user } = useUserStore();
	const role = user?.role ?? "PATIENT";
	const isProfessional = role === "PROFESSIONAL" || role === "ADMIN";

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
