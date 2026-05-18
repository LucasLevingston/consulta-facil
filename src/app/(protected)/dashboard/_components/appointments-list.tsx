import { ArrowRight, CalendarDays } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppointmentResponse } from "@/lib/schemas/appointment.schema";

import { AppointmentRow } from "./appointment-row";

interface AppointmentsListProps {
	appointments: AppointmentResponse[];
	isDoctor: boolean;
	onConfirm?: (id: string) => void;
	onComplete?: (id: string) => void;
}

export function AppointmentsList({
	appointments,
	isDoctor,
	onConfirm,
	onComplete,
}: AppointmentsListProps) {
	return (
		<Card className="border-border bg-card">
			<CardHeader className="flex flex-row items-center justify-between pb-4">
				<CardTitle className="text-base font-semibold">
					{isDoctor ? "Próximas consultas" : "Consultas recentes"}
				</CardTitle>
				<Link href="/dashboard/appointments">
					<Button variant="ghost" size="sm" className="gap-1 text-primary">
						Ver todas
						<ArrowRight className="h-3.5 w-3.5" />
					</Button>
				</Link>
			</CardHeader>
			<CardContent className="space-y-3">
				{appointments.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-10 text-center">
						<CalendarDays className="mb-3 h-10 w-10 text-muted-foreground/40" />
						<p className="text-sm text-muted-foreground">
							{isDoctor ? "Nenhuma consulta agendada." : "Nenhuma consulta encontrada."}
						</p>
						{!isDoctor && (
							<Link href="/dashboard/appointments/create" className="mt-3">
								<Button variant="outline" size="sm">
									Agendar agora
								</Button>
							</Link>
						)}
					</div>
				) : (
					appointments.map((appointment) => (
						<AppointmentRow
							key={appointment.id}
							appointment={appointment}
							isDoctor={isDoctor}
							onConfirm={onConfirm}
							onComplete={onComplete}
						/>
					))
				)}
			</CardContent>
		</Card>
	);
}
