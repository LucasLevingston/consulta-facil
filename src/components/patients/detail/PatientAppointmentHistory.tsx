import { CalendarDays } from "lucide-react";

import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import { formatDateTime } from "@/lib/utils/format-date-time";

export function PatientAppointmentHistory({
	appointments,
}: {
	appointments: AppointmentResponse[];
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base flex items-center gap-2">
					<CalendarDays className="h-4 w-4" />
					Histórico de consultas
				</CardTitle>
			</CardHeader>
			<CardContent>
				{appointments.length === 0 ? (
					<div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-border">
						<p className="text-sm text-muted-foreground">
							Nenhuma consulta registrada.
						</p>
					</div>
				) : (
					<div className="space-y-2">
						{appointments.map((appt) => (
							<div
								key={appt.id}
								className="flex flex-col gap-2 rounded-xl border border-border/60 bg-background/60 p-3 sm:flex-row sm:items-center sm:justify-between"
							>
								<div>
									<p className="text-sm font-medium">
										{appt.reason ?? "Sem motivo informado"}
									</p>
									<p className="text-xs text-muted-foreground">
										{formatDateTime(new Date(appt.scheduledAt)).dateTime}
										{appt.professionalName && ` · ${appt.professionalName}`}
									</p>
									{appt.specialty && (
										<Badge variant="outline" className="mt-1 text-xs">
											{appt.specialty}
										</Badge>
									)}
								</div>
								<StatusBadge status={appt.status} />
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
