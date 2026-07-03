"use client";

import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { AppointmentResponse } from "@/features/appointments";
import { STATUS_CLASS } from "@/utils/constants/appointment-status-class";
import { STATUS_LABEL } from "@/utils/constants/appointment-status-label";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";

interface Props {
	appt: AppointmentResponse;
}

export function ClinicAppointmentCard({ appt }: Props) {
	return (
		<Card className="transition-shadow hover:shadow-sm">
			<CardContent className="flex flex-wrap items-center gap-3 p-4">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 flex-wrap">
						<p className="text-sm font-semibold truncate">
							{appt.patientName ?? "Paciente"}
						</p>
						<Badge variant="outline" className={STATUS_CLASS[appt.status]}>
							{STATUS_LABEL[appt.status]}
						</Badge>
					</div>
					<p className="mt-0.5 text-xs text-muted-foreground">
						{appt.professionalName ?? "—"} ·{" "}
						{appt.specialty
							? (SPECIALTY_LABELS[appt.specialty] ?? appt.specialty)
							: "—"}
					</p>
				</div>
				<div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
					<CalendarDays className="h-3.5 w-3.5" />
					<span>
						{new Date(appt.scheduledAt).toLocaleDateString("pt-BR", {
							day: "2-digit",
							month: "short",
							year: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</span>
				</div>
			</CardContent>
		</Card>
	);
}
