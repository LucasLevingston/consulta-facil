"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { User, Video } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { AppointmentResponse } from "@/features/appointments";

interface Props {
	appointment: AppointmentResponse;
	isOnline: boolean;
	isProfessional: boolean;
}

export function AppointmentScheduleCardInfo({
	appointment,
	isOnline,
	isProfessional,
}: Props) {
	const scheduledDate = new Date(appointment.scheduledAt);
	return (
		<CardContent className="space-y-3 -mt-2">
			<div className="grid grid-cols-2 gap-4 text-sm">
				<div>
					<p className="text-xs text-muted-foreground mb-0.5">Data</p>
					<p className="font-medium">
						{format(scheduledDate, "dd/MM/yyyy", { locale: ptBR })}
					</p>
				</div>
				<div>
					<p className="text-xs text-muted-foreground mb-0.5">Horário</p>
					<p className="font-medium">
						{format(scheduledDate, "HH:mm", { locale: ptBR })}
					</p>
				</div>
				<div>
					<p className="text-xs text-muted-foreground mb-0.5">Modalidade</p>
					<p className="font-medium flex items-center gap-1">
						{isOnline ? (
							<>
								<Video className="h-3.5 w-3.5 text-blue-500" />
								Teleconsulta
							</>
						) : (
							"Presencial"
						)}
					</p>
				</div>
			</div>
			{appointment.previousScheduledAt && (
				<>
					<Separator />
					<div>
						<p className="text-xs text-muted-foreground mb-0.5">
							Data original
						</p>
						<p className="text-sm text-muted-foreground line-through">
							{format(
								new Date(appointment.previousScheduledAt),
								"dd/MM/yyyy 'às' HH:mm",
								{ locale: ptBR },
							)}
						</p>
					</div>
				</>
			)}
			{appointment.reason && (
				<>
					<Separator />
					<div>
						<p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
							<User className="h-3 w-3" />
							Motivo
						</p>
						<p className="text-sm">{appointment.reason}</p>
					</div>
				</>
			)}
			{isProfessional && appointment.patientName && (
				<>
					<Separator />
					<div>
						<p className="text-xs text-muted-foreground mb-0.5">Paciente</p>
						<p className="text-sm font-medium">{appointment.patientName}</p>
					</div>
				</>
			)}
		</CardContent>
	);
}
