import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { AppointmentResponse } from "@/features/appointments";

export function ProfileNextAppointment({
	appointment,
	isProfessional,
}: {
	appointment: AppointmentResponse;
	isProfessional: boolean;
}) {
	return (
		<Card className="border-primary/20 bg-primary/5">
			<CardContent className="flex items-center gap-4 py-4 px-6">
				<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
					<CalendarDays className="h-5 w-5 text-primary" />
				</div>
				<div className="flex-1 min-w-0">
					<p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
						Próxima consulta
					</p>
					<p className="text-sm font-semibold text-foreground">
						{isProfessional
							? `Paciente: ${appointment.patientName ?? "—"}`
							: `${appointment.professionalName ?? "—"}`}
					</p>
					<p className="text-xs text-muted-foreground">
						{format(
							new Date(appointment.scheduledAt),
							"EEEE, d 'de' MMMM 'às' HH:mm",
							{ locale: ptBR },
						)}
					</p>
				</div>
				<Badge
					variant={appointment.status === "CONFIRMED" ? "default" : "secondary"}
					className="shrink-0 rounded-full text-xs"
				>
					{appointment.status === "CONFIRMED" ? "Confirmada" : "Pendente"}
				</Badge>
			</CardContent>
		</Card>
	);
}
