"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo } from "react";

import { CheckInQrSection } from "@/components/clinics/queue/CheckInQrSection";
import { QueueCard } from "@/components/clinics/queue/QueueCard";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";
import type { AppointmentResponse } from "@/features/appointments";
import { useClinicById, useClinicQueue } from "@/features/clinics";

function ClinicQueueContent({ id }: { id: string }) {
	const { data: clinic } = useClinicById(id);
	const { data: queue = [], isLoading } = useClinicQueue(id);

	const byProfessional = useMemo(() => {
		const map = new Map<string, AppointmentResponse[]>();
		for (const appt of queue) {
			const key = appt.professionalId ?? "";
			if (!map.has(key)) map.set(key, []);
			map.get(key)?.push(appt);
		}
		return Array.from(map.entries()).map(([, appointments]) => ({
			professionalId: appointments[0].professionalId,
			professionalName: appointments[0].professionalName ?? "Profissional",
			specialty: appointments[0].specialty,
			appointments,
		}));
	}, [queue]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
			<div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
				<div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div className="text-center sm:text-left space-y-1">
						<h1 className="text-3xl font-bold text-foreground">
							{clinic.name}
						</h1>
						<p className="text-sm text-muted-foreground">
							{format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", {
								locale: ptBR,
							})}
						</p>
						<div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-muted-foreground mt-1">
							<div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
							Atualizado automaticamente a cada 30 segundos
						</div>
					</div>
					<CheckInQrSection clinicId={id} />
				</div>

				{isLoading ? (
					<div className="flex h-40 items-center justify-center">
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					</div>
				) : byProfessional.length === 0 ? (
					<div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-border gap-3">
						<Users className="h-10 w-10 text-muted-foreground/40" />
						<p className="text-muted-foreground">
							Nenhum paciente na fila no momento.
						</p>
					</div>
				) : (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{byProfessional.map((prof) => (
							<QueueCard
								key={prof.professionalId}
								professionalName={prof.professionalName}
								specialty={prof.specialty}
								appointments={prof.appointments}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export function ClinicQueueView() {
	const { id } = useParams<{ id: string }>();

	return (
		<SuspenseBoundary>
			<ClinicQueueContent id={id} />
		</SuspenseBoundary>
	);
}
