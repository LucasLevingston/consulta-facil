"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MonitorCheck, PhoneCall, QrCode, RefreshCw, User } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import PageHeader from "@/components/custom/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCallPatient, useCheckInByQr, useQueue } from "@/hooks/api/use-appointments";
import type { AppointmentResponse } from "@/lib/schemas/appointment.schema";

export default function ReceptionPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Painel de Recepção"
				description="Gerencie check-ins e o fluxo de pacientes da clínica."
				icon={<MonitorCheck className="h-6 w-6" />}
			/>
			<div className="grid gap-6 md:grid-cols-2">
				<CheckInPanel />
				<QueuePanel />
			</div>
		</div>
	);
}

function CheckInPanel() {
	const { mutateAsync: checkIn, isPending } = useCheckInByQr();
	const [token, setToken] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	async function handleCheckIn() {
		const t = token.trim();
		if (!t) return;
		try {
			const result = await checkIn(t);
			toast.success(`Check-in realizado: ${result.patientName}`);
			setToken("");
			inputRef.current?.focus();
		} catch {
			toast.error("Token inválido ou expirado.");
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
					<QrCode className="h-4 w-4" />
					Check-in por QR Code
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3 -mt-2">
				<p className="text-xs text-muted-foreground">
					Cole ou digitalize o token do QR Code do paciente abaixo.
				</p>
				<div className="flex gap-2">
					<Input
						ref={inputRef}
						value={token}
						onChange={(e) => setToken(e.target.value)}
						placeholder="Token do QR Code..."
						className="flex-1 font-mono text-xs"
						onKeyDown={(e) => e.key === "Enter" && handleCheckIn()}
					/>
					<Button onClick={handleCheckIn} disabled={isPending || !token.trim()}>
						{isPending ? "Aguarde..." : "Check-in"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

function QueuePanel() {
	const { data: queue = [], isLoading, refetch, isFetching } = useQueue();

	const checkedIn = queue.filter((a) => a.status === "CHECKED_IN");
	const inProgress = queue.filter((a) => a.status === "IN_PROGRESS");

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
						<User className="h-4 w-4" />
						Fila de espera ({checkedIn.length})
					</CardTitle>
					<Button
						size="icon"
						variant="ghost"
						className="h-7 w-7"
						onClick={() => refetch()}
						disabled={isFetching}
					>
						<RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
					</Button>
				</div>
			</CardHeader>
			<CardContent className="-mt-2 space-y-4">
				{isLoading ? (
					<p className="text-sm text-muted-foreground">Carregando...</p>
				) : queue.length === 0 ? (
					<p className="text-sm text-muted-foreground">Nenhum paciente na fila.</p>
				) : (
					<>
						{inProgress.length > 0 && (
							<div className="space-y-2">
								<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
									Em atendimento
								</p>
								{inProgress.map((a) => <QueueCard key={a.id} appointment={a} />)}
							</div>
						)}
						{inProgress.length > 0 && checkedIn.length > 0 && <Separator />}
						{checkedIn.length > 0 && (
							<div className="space-y-2">
								<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
									Aguardando
								</p>
								{checkedIn.map((a) => <QueueCard key={a.id} appointment={a} />)}
							</div>
						)}
					</>
				)}
			</CardContent>
		</Card>
	);
}

function QueueCard({ appointment }: { appointment: AppointmentResponse }) {
	const { mutateAsync: call, isPending } = useCallPatient();

	async function handleCall() {
		try {
			await call(appointment.id);
			toast.success(`${appointment.patientName} chamado!`);
		} catch {
			toast.error("Erro ao chamar paciente.");
		}
	}

	const checkedInAt = appointment.checkedInAt ? new Date(appointment.checkedInAt) : null;

	return (
		<div className="flex items-center justify-between gap-3 rounded-lg border p-3">
			<div className="min-w-0">
				<p className="text-sm font-medium truncate">{appointment.patientName}</p>
				<div className="flex items-center gap-2 mt-0.5">
					<Badge
						variant={appointment.status === "IN_PROGRESS" ? "default" : "secondary"}
						className="text-xs"
					>
						{appointment.status === "IN_PROGRESS" ? "Em atendimento" : "Aguardando"}
					</Badge>
					{checkedInAt && (
						<span className="text-xs text-muted-foreground">
							{format(checkedInAt, "HH:mm", { locale: ptBR })}
						</span>
					)}
				</div>
			</div>
			{appointment.status === "CHECKED_IN" && (
				<Button size="sm" variant="outline" className="gap-1.5 shrink-0" onClick={handleCall} disabled={isPending}>
					<PhoneCall className="h-3.5 w-3.5" />
					Chamar
				</Button>
			)}
		</div>
	);
}
