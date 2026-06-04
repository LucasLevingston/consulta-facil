"use client";

import { CalendarPlus } from "lucide-react";
import { Suspense, useState } from "react";
import type { VoiceBookingResult } from "@/app/api/voice-booking/route";
import PageHeader from "@/components/custom/page-header";
import { VoiceBookingButton } from "@/components/custom/voice-booking-button";
import { AppointmentForm } from "@/components/forms/Appointments/AppointmentForm";

export default function CreateAppointment() {
	const [voicePreset, setVoicePreset] = useState<VoiceBookingResult | null>(
		null,
	);

	return (
		<div className="space-y-6">
			<PageHeader
				title="Agendar Consulta"
				description="Escolha o profissional, data e horário para sua consulta."
				icon={<CalendarPlus className="h-6 w-6" />}
			/>

			<div>
				<div className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8 space-y-6">
					<VoiceBookingButton onResult={setVoicePreset} />
					<Suspense>
						<AppointmentForm type="create" voicePreset={voicePreset} />
					</Suspense>
				</div>
			</div>
		</div>
	);
}
