import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, Stethoscope, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";

export function QueueCard({
	professionalName,
	specialty,
	appointments,
}: {
	professionalName: string;
	specialty?: string | null;
	appointments: AppointmentResponse[];
}) {
	const inProgress = appointments.find((a) => a.status === "IN_PROGRESS");
	const waiting = appointments.filter((a) => a.status === "CHECKED_IN");

	return (
		<Card className="overflow-hidden border-border">
			<CardHeader className="bg-primary/5 pb-3">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
						<Stethoscope className="h-5 w-5 text-primary" />
					</div>
					<div>
						<CardTitle className="text-base">{professionalName}</CardTitle>
						{specialty && (
							<p className="text-xs text-muted-foreground">
								{SPECIALTY_LABELS[specialty] ?? specialty}
							</p>
						)}
					</div>
					<Badge variant="secondary" className="ml-auto gap-1 text-xs">
						<Users className="h-3 w-3" />
						{waiting.length} aguardando
					</Badge>
				</div>
			</CardHeader>

			<CardContent className="p-4 space-y-3">
				{inProgress ? (
					<div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/5 px-4 py-3">
						<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-500/10">
							<Clock className="h-4 w-4 text-green-600 animate-pulse" />
						</div>
						<div>
							<p className="text-xs font-semibold text-green-600 uppercase tracking-wide">
								Em atendimento
							</p>
							<p className="font-semibold text-foreground">
								{inProgress.patientName}
							</p>
							{inProgress.checkedInAt && (
								<p className="text-xs text-muted-foreground">
									Chamado às{" "}
									{format(new Date(inProgress.checkedInAt), "HH:mm", {
										locale: ptBR,
									})}
								</p>
							)}
						</div>
					</div>
				) : (
					<div className="flex h-14 items-center justify-center rounded-xl border border-dashed border-border">
						<p className="text-xs text-muted-foreground">
							Nenhum paciente em atendimento
						</p>
					</div>
				)}

				{waiting.length > 0 && (
					<div className="space-y-1.5">
						<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
							Fila de espera
						</p>
						{waiting.map((appt, idx) => (
							<div
								key={appt.id}
								className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 px-3 py-2.5"
							>
								<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
									{idx + 1}
								</div>
								<p className="text-sm font-medium flex-1">{appt.patientName}</p>
								{appt.checkedInAt && (
									<p className="text-xs text-muted-foreground shrink-0">
										{format(new Date(appt.checkedInAt), "HH:mm")}
									</p>
								)}
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
