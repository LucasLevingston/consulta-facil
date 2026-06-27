import { ArrowRight, CalendarDays } from "lucide-react";
import Link from "next/link";
import { CustomButton } from "@/components/custom/custom-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentRow } from "./appointment-row";
import type { AppointmentsListProps } from "./appointments-list.types";

export function AppointmentsList({
	appointments,
	isProfessional,
	onConfirm,
	onComplete,
}: AppointmentsListProps) {
	return (
		<Card className="border-border bg-card">
			<CardHeader className="flex flex-row items-center justify-between pb-4">
				<CardTitle className="text-base font-semibold">
					{isProfessional ? "Próximas consultas" : "Consultas recentes"}
				</CardTitle>
				<Link href="/dashboard/appointments">
					<CustomButton variant="secondary">
						Ver todas
						<ArrowRight className="h-3.5 w-3.5" />
					</CustomButton>
				</Link>
			</CardHeader>
			<CardContent className="space-y-3">
				{appointments.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-10 text-center">
						<CalendarDays className="mb-3 h-10 w-10 text-muted-foreground/40" />
						<p className="text-sm text-muted-foreground">
							{isProfessional
								? "Nenhuma consulta agendada."
								: "Nenhuma consulta encontrada."}
						</p>
						{!isProfessional && (
							<Link href="/dashboard/appointments/create" className="mt-3">
								<CustomButton variant="outline" size="sm">
									Agendar agora
								</CustomButton>
							</Link>
						)}
					</div>
				) : (
					appointments.map((appointment) => (
						<AppointmentRow
							key={appointment.id}
							appointment={appointment}
							isProfessional={isProfessional}
							onConfirm={onConfirm}
							onComplete={onComplete}
						/>
					))
				)}
			</CardContent>
		</Card>
	);
}
