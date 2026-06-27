import { Stethoscope, User } from "lucide-react";

import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils/format-date-time";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";
import type { AppointmentRowProps } from "./appointment-row.types";

export function AppointmentRow({
	appointment,
	isProfessional,
	onConfirm,
	onComplete,
}: AppointmentRowProps) {
	const label = isProfessional
		? (appointment.patientName ?? "Paciente não definido")
		: appointment.professionalName
			? appointment.professionalName
			: "Profissional não definido";

	const icon = isProfessional ? (
		<User className="h-4 w-4" />
	) : (
		<Stethoscope className="h-4 w-4" />
	);

	return (
		<div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-background/60 p-3 transition-colors hover:bg-background sm:flex-row sm:items-center sm:justify-between">
			<div className="flex items-center gap-3">
				<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
					{icon}
				</div>
				<div>
					<p className="text-sm font-medium text-foreground">{label}</p>
					<p className="text-xs text-muted-foreground">
						{formatDateTime(new Date(appointment.scheduledAt)).dateTime}
					</p>
				</div>
			</div>
			<div className="flex items-center gap-2">
				{!isProfessional && appointment.specialty && (
					<Badge variant="outline" className="hidden text-xs sm:inline-flex">
						{SPECIALTY_LABELS[appointment.specialty] ?? appointment.specialty}
					</Badge>
				)}
				<StatusBadge status={appointment.status} />
				{isProfessional && appointment.status === "PENDING" && onConfirm && (
					<Button
						size="sm"
						variant="outline"
						onClick={() => onConfirm(appointment.id)}
					>
						Confirmar
					</Button>
				)}
				{isProfessional && appointment.status === "CONFIRMED" && onComplete && (
					<Button
						size="sm"
						variant="outline"
						onClick={() => onComplete(appointment.id)}
					>
						Concluir
					</Button>
				)}
			</div>
		</div>
	);
}
