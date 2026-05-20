"use client";

import { CalendarPlus } from "lucide-react";
import { Suspense } from "react";

import { AppointmentForm } from "@/components/custom/forms/Appointments/AppointmentForm";
import PageHeader from "@/components/custom/page-header";

export default function AgendarConsultaPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Agendar Consulta"
				description="Escolha o profissional, data e horário para sua consulta."
				icon={<CalendarPlus className="h-6 w-6" />}
			/>

			<div>
				<div className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
					<Suspense>
						<AppointmentForm type="create" />
					</Suspense>
				</div>
			</div>
		</div>
	);
}
