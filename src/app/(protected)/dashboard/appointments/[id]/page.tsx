"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
	ArrowLeft,
	CalendarDays,
	FileText,
	MessageSquare,
	Star,
	Stethoscope,
	User,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";

import { RateAppointmentForm } from "@/components/custom/forms/Appointments/RateAppointmentForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useAppointment } from "@/hooks/api/use-appointments";
import type { AppointmentResponse, AppointmentStatus } from "@/lib/schemas/appointment.schema";
import { QueryBoundary } from "@/providers/query-boundary";
import { useUserStore } from "@/store/useUserStore";

const STATUS_CONFIG: Record<
	AppointmentStatus,
	{ label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
	PENDING: { label: "Pendente", variant: "secondary" },
	CONFIRMED: { label: "Confirmada", variant: "default" },
	COMPLETED: { label: "Concluída", variant: "outline" },
	CANCELED: { label: "Cancelada", variant: "destructive" },
};

function StarDisplay({ rating }: { rating: number }) {
	return (
		<div className="flex gap-0.5">
			{[1, 2, 3, 4, 5].map((n) => (
				<Star
					key={n}
					className={`h-4 w-4 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
				/>
			))}
		</div>
	);
}

function AppointmentDetail({ appointment }: { appointment: AppointmentResponse }) {
	const { user } = useUserStore();
	const [rateOpen, setRateOpen] = useState(false);

	const role = (user?.role ?? "PATIENT") as "PATIENT" | "DOCTOR" | "ADMIN";
	const isPatient = role === "PATIENT";
	const canRate = isPatient && appointment.status === "COMPLETED" && appointment.rating == null;

	const statusConfig = STATUS_CONFIG[appointment.status];

	const scheduledDate = new Date(appointment.scheduledAt);

	return (
		<div className="mx-auto max-w-2xl space-y-6">
			<div className="flex items-center gap-3">
				<Button variant="ghost" size="sm" className="gap-2 -ml-2" asChild>
					<Link href="/dashboard/appointments">
						<ArrowLeft className="h-4 w-4" />
						Voltar
					</Link>
				</Button>
			</div>

			{/* Header */}
			<div className="flex items-start justify-between gap-4">
				<div>
					<h1 className="text-xl font-bold text-foreground">Detalhes da consulta</h1>
					<p className="text-sm text-muted-foreground mt-0.5">
						{format(scheduledDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
					</p>
				</div>
				<Badge variant={statusConfig.variant} className="shrink-0">
					{statusConfig.label}
				</Badge>
			</div>

			{/* Doctor info */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
						<Stethoscope className="h-4 w-4" />
						Profissional
					</CardTitle>
				</CardHeader>
				<CardContent className="flex items-center gap-4 -mt-2">
					<Avatar className="h-12 w-12 shrink-0">
						<AvatarImage alt={appointment.doctorName ?? ""} />
						<AvatarFallback>{(appointment.doctorName ?? "?")[0]}</AvatarFallback>
					</Avatar>
					<div>
						<p className="font-semibold">{appointment.doctorName}</p>
						{appointment.specialty && (
							<p className="text-sm text-muted-foreground">{appointment.specialty}</p>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Schedule info */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
						<CalendarDays className="h-4 w-4" />
						Agendamento
					</CardTitle>
				</CardHeader>
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
					</div>

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

					{role !== "PATIENT" && appointment.patientName && (
						<>
							<Separator />
							<div>
								<p className="text-xs text-muted-foreground mb-0.5">Paciente</p>
								<p className="text-sm font-medium">{appointment.patientName}</p>
							</div>
						</>
					)}
				</CardContent>
			</Card>

			{/* Notes (visible after completed) */}
			{appointment.notes && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
							<FileText className="h-4 w-4" />
							Observações do médico
						</CardTitle>
					</CardHeader>
					<CardContent className="-mt-2">
						<p className="text-sm leading-relaxed">{appointment.notes}</p>
					</CardContent>
				</Card>
			)}

			{/* Cancellation reason */}
			{appointment.status === "CANCELED" && appointment.cancellationReason && (
				<Card className="border-destructive/30 bg-destructive/5">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-sm text-destructive/80 font-medium">
							<XCircle className="h-4 w-4" />
							Motivo do cancelamento
						</CardTitle>
					</CardHeader>
					<CardContent className="-mt-2">
						<p className="text-sm">{appointment.cancellationReason}</p>
					</CardContent>
				</Card>
			)}

			{/* Rating */}
			{appointment.status === "COMPLETED" && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
							<MessageSquare className="h-4 w-4" />
							Avaliação
						</CardTitle>
					</CardHeader>
					<CardContent className="-mt-2">
						{appointment.rating != null ? (
							<div className="space-y-2">
								<StarDisplay rating={appointment.rating} />
								{appointment.ratingComment && (
									<p className="text-sm text-muted-foreground italic">
										&ldquo;{appointment.ratingComment}&rdquo;
									</p>
								)}
							</div>
						) : canRate ? (
							<div className="flex flex-col items-start gap-3">
								<p className="text-sm text-muted-foreground">
									Você ainda não avaliou esta consulta.
								</p>
								<Button
									size="sm"
									className="gap-2"
									onClick={() => setRateOpen(true)}
								>
									<Star className="h-4 w-4" />
									Avaliar consulta
								</Button>
								<Dialog open={rateOpen} onOpenChange={setRateOpen}>
									<DialogContent className="sm:max-w-md">
										<DialogHeader className="mb-2 space-y-1">
											<DialogTitle>Avaliar consulta</DialogTitle>
											<DialogDescription>
												Sua avaliação ajuda outros pacientes a escolher o profissional certo.
											</DialogDescription>
										</DialogHeader>
										<RateAppointmentForm appointment={appointment} setOpen={setRateOpen} />
									</DialogContent>
								</Dialog>
							</div>
						) : (
							<p className="text-sm text-muted-foreground">Sem avaliação.</p>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}

export default function AppointmentDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const { data, isLoading, error } = useAppointment(id);

	return (
		<QueryBoundary isLoading={isLoading} error={error}>
			{data && <AppointmentDetail appointment={data} />}
		</QueryBoundary>
	);
}
