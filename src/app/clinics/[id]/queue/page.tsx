"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, Loader2, QrCode, Stethoscope, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClinicById, useClinicQueue } from "@/hooks/api/use-clinics";
import type { AppointmentResponse } from "@/lib/schemas/appointment.schema";

function QueueCard({
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
							<p className="text-xs text-muted-foreground">{specialty}</p>
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

function CheckInQrSection({ clinicId }: { clinicId: string }) {
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	const QRCodeSVG = require("qrcode.react").QRCodeSVG;
	const url =
		typeof window !== "undefined"
			? `${window.location.origin}/clinics/${clinicId}/checkin`
			: `/clinics/${clinicId}/checkin`;

	return (
		<div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5">
			<div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
				<QrCode className="h-4 w-4" />
				QR Code para check-in dos pacientes
			</div>
			<div className="rounded-xl bg-white p-3 shadow-sm">
				<QRCodeSVG value={url} size={140} level="M" />
			</div>
			<p className="text-xs text-muted-foreground text-center max-w-xs">
				Pacientes escaneiam este código com o celular para entrar na fila.
			</p>
		</div>
	);
}

export default function ClinicQueuePage() {
	const { id } = useParams<{ id: string }>();

	const { data: clinic } = useClinicById(id);
	const { data: queue = [], isLoading } = useClinicQueue(id);

	const byProfessional = useMemo(() => {
		const map = new Map<string, AppointmentResponse[]>();
		for (const appt of queue) {
			const key = appt.professionalId ?? "";
			if (!map.has(key)) map.set(key, []);
			map.get(key)!.push(appt);
		}
		return Array.from(map.entries()).map(([, appointments]) => ({
			professionalId: appointments[0].professionalId,
			professionalName: appointments[0].professionalName ?? "Profissional",
			specialty: appointments[0].specialty,
			appointments,
		}));
	}, [queue]);

	const now = new Date();

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
			<div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
				{/* Header */}
				<div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div className="text-center sm:text-left space-y-1">
						<h1 className="text-3xl font-bold text-foreground">
							{clinic?.name ?? "Fila de Espera"}
						</h1>
						<p className="text-sm text-muted-foreground">
							{format(now, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
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
