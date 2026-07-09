import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { AppointmentResponse } from "@/features/appointments";
import {
	PAYMENT_LABELS,
	PAYMENT_VARIANTS,
} from "@/utils/constants/appointment-payment-status";

export function AppointmentPaymentCard({
	appointment,
	showProfessionalName,
}: {
	appointment: AppointmentResponse;
	showProfessionalName: boolean;
}) {
	return (
		<Card className="border-border transition-shadow hover:shadow-md">
			<CardContent className="p-5">
				<div className="flex items-start justify-between gap-2">
					<div className="min-w-0 flex-1">
						<p className="truncate font-semibold text-foreground">
							{appointment.patientName ?? "Paciente"}
						</p>
						{showProfessionalName && appointment.professionalName && (
							<p className="truncate text-xs text-muted-foreground mt-0.5">
								{appointment.professionalName}
							</p>
						)}
						<p className="mt-0.5 text-xs text-muted-foreground">
							{format(
								new Date(appointment.scheduledAt),
								"dd/MM/yyyy 'às' HH:mm",
								{ locale: ptBR },
							)}
						</p>
					</div>

					{appointment.paymentStatus && (
						<Badge
							variant={PAYMENT_VARIANTS[appointment.paymentStatus] ?? "outline"}
							className="shrink-0 text-xs"
						>
							{PAYMENT_LABELS[appointment.paymentStatus] ??
								appointment.paymentStatus}
						</Badge>
					)}
				</div>

				{appointment.paymentAmount != null && appointment.paymentAmount > 0 && (
					<p className="mt-3 text-lg font-bold text-foreground">
						{appointment.paymentAmount.toLocaleString("pt-BR", {
							style: "currency",
							currency: "BRL",
						})}
					</p>
				)}

				{appointment.serviceName && (
					<p className="mt-1 text-xs text-muted-foreground">
						{appointment.serviceName}
					</p>
				)}
			</CardContent>
		</Card>
	);
}
