"use client";

import { MonitorCheck } from "lucide-react";
import PageHeader from "@/components/custom/page-header";
import { CheckInPanel } from "@/components/reception/CheckInPanel";
import { QueuePanel } from "@/components/reception/QueuePanel";

export default function ReceptionPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Painel de Recepção"
				description="Gerencie check-ins e o fluxo de pacientes da clínica."
				icon={<MonitorCheck className="h-6 w-6" />}
			/>
			<div className="grid gap-6 md:grid-cols-2">
				<CheckInPanel />
				<QueuePanel />
			</div>
		</div>
	);
}
