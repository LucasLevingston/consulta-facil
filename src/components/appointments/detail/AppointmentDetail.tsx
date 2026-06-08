"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
	ArrowLeft,
	CalendarDays,
	CreditCard,
	ExternalLink,
	MessageSquare,
	QrCode,
	RefreshCw,
	Star,
	Stethoscope,
	User,
	Video,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { AbacGuard } from "@/components/AbacGuard";
import { CustomButton } from "@/components/custom/custom-button";
import { VideoRoom } from "@/components/custom/VideoRoom";
import { ExamsSection } from "@/components/forms/Appointments/ExamsSection";
import { RateAppointmentForm } from "@/components/forms/Appointments/RateAppointmentForm";
import { RescheduleAppointmentForm } from "@/components/forms/Appointments/RescheduleAppointmentForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useCreatePayment } from "@/hooks/api/appointments/use-create-payment";
import { useGenerateMeetLink } from "@/hooks/api/appointments/use-generate-meet-link";
import { useCreateRoom } from "@/hooks/api/video/use-create-room";
import { useRoomToken } from "@/hooks/api/video/use-room-token";
import { usePermission } from "@/hooks/use-permission";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import { useUserStore } from "@/store/useUserStore";
import { STATUS_CONFIG } from "@/utils/constants/appointment-status-config";

import { AnamnesisSection } from "./AnamnesisSection";
import { ProntuarioSection } from "./ProntuarioSection";
import { QrCodeDialog } from "./QrCodeDialog";
import { StarDisplay } from "./StarDisplay";

export function AppointmentDetail({
	appointment,
}: {
	appointment: AppointmentResponse;
}) {
	const { user } = useUserStore();
	const { can } = usePermission();
	const [rateOpen, setRateOpen] = useState(false);
	const [rescheduleOpen, setRescheduleOpen] = useState(false);
	const [qrOpen, setQrOpen] = useState(false);

	const { mutateAsync: generateMeetLink, isPending: generatingLink } =
		useGenerateMeetLink();
	const { mutateAsync: createPayment, isPending: creatingPayment } =
		useCreatePayment();
	const { mutateAsync: createRoom, isPending: creatingRoom } = useCreateRoom();
	const [videoActive, setVideoActive] = useState(false);
	const [videoAppointmentId, setVideoAppointmentId] = useState<string | null>(
		null,
	);
	const { data: videoRoom } = useRoomToken(videoAppointmentId);

	const role = user?.role ?? "PATIENT";
	const isPatient = role === "PATIENT";
	const isProfessional = role === "PROFESSIONAL" || role === "ADMIN";
	const isOnline = appointment.modality === "ONLINE";
	const canRate =
		isPatient &&
		appointment.status === "COMPLETED" &&
		appointment.rating == null;
	const canReschedule =
		appointment.status === "PENDING" || appointment.status === "CONFIRMED";

	const statusConfig = STATUS_CONFIG[appointment.status];
	const scheduledDate = new Date(appointment.scheduledAt);

	return (
		<div className="mx-auto max-w-2xl space-y-6">
			<div className="flex items-center gap-3">
				<CustomButton variant="ghost" size="sm" className="gap-2 -ml-2" asChild>
					<Link href="/dashboard/appointments">
						<ArrowLeft className="h-4 w-4" />
						Voltar
					</Link>
				</CustomButton>
			</div>

			<div className="flex items-start justify-between gap-4">
				<div>
					<h1 className="text-xl font-bold text-foreground">
						Detalhes da consulta
					</h1>
					<p className="text-sm text-muted-foreground mt-0.5">
						{format(scheduledDate, "EEEE, dd 'de' MMMM 'de' yyyy", {
							locale: ptBR,
						})}
					</p>
				</div>
				<Badge variant={statusConfig.variant} className="shrink-0">
					{statusConfig.label}
				</Badge>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
						<Stethoscope className="h-4 w-4" />
						Profissional
					</CardTitle>
				</CardHeader>
				<CardContent className="flex items-center gap-4 -mt-2">
					<Avatar className="h-12 w-12 shrink-0">
						<AvatarImage alt={appointment.professionalName ?? ""} />
						<AvatarFallback>
							{(appointment.professionalName ?? "?")[0]}
						</AvatarFallback>
					</Avatar>
					<div>
						<p className="font-semibold">{appointment.professionalName}</p>
						{appointment.specialty && (
							<p className="text-sm text-muted-foreground">
								{appointment.specialty}
							</p>
						)}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
							<CalendarDays className="h-4 w-4" />
							Agendamento
						</CardTitle>
						<div className="flex flex-wrap gap-2">
							{isOnline && appointment.meetLink && (
								<CustomButton size="sm" className="gap-2" asChild>
									<a
										href={appointment.meetLink}
										target="_blank"
										rel="noopener noreferrer"
									>
										<Video className="h-3.5 w-3.5" />
										Entrar na consulta
										<ExternalLink className="h-3 w-3" />
									</a>
								</CustomButton>
							)}
							{isOnline && !appointment.meetLink && isProfessional && (
								<CustomButton
									variant="outline"
									size="sm"
									className="gap-2"
									disabled={generatingLink}
									onClick={() => generateMeetLink(appointment.id)}
								>
									<Video className="h-3.5 w-3.5" />
									{generatingLink ? "Gerando..." : "Gerar link Meet"}
								</CustomButton>
							)}
							{isOnline &&
								isProfessional &&
								(appointment.status === "CONFIRMED" ||
									appointment.status === "PENDING") && (
									<CustomButton
										size="sm"
										className="gap-2"
										disabled={creatingRoom}
										onClick={async () => {
											try {
												await createRoom(appointment.id);
												setVideoAppointmentId(appointment.id);
												setVideoActive(true);
											} catch {
												toast.error("Erro ao iniciar teleconsulta.");
											}
										}}
									>
										<Video className="h-3.5 w-3.5" />
										{creatingRoom ? "Iniciando..." : "Iniciar teleconsulta"}
									</CustomButton>
								)}
							{isOnline && isPatient && videoRoom && !videoActive && (
								<CustomButton
									size="sm"
									className="gap-2"
									onClick={() => {
										setVideoAppointmentId(appointment.id);
										setVideoActive(true);
									}}
								>
									<Video className="h-3.5 w-3.5" />
									Entrar na consulta
								</CustomButton>
							)}
							{isPatient && appointment.status === "CONFIRMED" && !isOnline && (
								<CustomButton
									variant="outline"
									size="sm"
									className="gap-2"
									onClick={() => setQrOpen(true)}
								>
									<QrCode className="h-3.5 w-3.5" />
									QR Check-in
								</CustomButton>
							)}
							{canReschedule && (
								<AbacGuard
									permission="appointment:reschedule:own"
									attrs={{
										userId: user?.id,
										ownerId: isPatient
											? appointment.patientId
											: appointment.professionalId,
									}}
								>
									<CustomButton
										variant="outline"
										size="sm"
										className="gap-2"
										onClick={() => setRescheduleOpen(true)}
									>
										<RefreshCw className="h-3.5 w-3.5" />
										Remarcar
									</CustomButton>
								</AbacGuard>
							)}
						</div>
					</div>
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
						<div>
							<p className="text-xs text-muted-foreground mb-0.5">Modalidade</p>
							<p className="font-medium flex items-center gap-1">
								{isOnline ? (
									<>
										<Video className="h-3.5 w-3.5 text-blue-500" />
										Teleconsulta
									</>
								) : (
									"Presencial"
								)}
							</p>
						</div>
					</div>

					{appointment.previousScheduledAt && (
						<>
							<Separator />
							<div>
								<p className="text-xs text-muted-foreground mb-0.5">
									Data original
								</p>
								<p className="text-sm text-muted-foreground line-through">
									{format(
										new Date(appointment.previousScheduledAt),
										"dd/MM/yyyy 'às' HH:mm",
										{ locale: ptBR },
									)}
								</p>
							</div>
						</>
					)}

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

					{isProfessional && appointment.patientName && (
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

			<Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader className="mb-2 space-y-1">
						<DialogTitle>Remarcar consulta</DialogTitle>
						<DialogDescription>
							Selecione a nova data e horário para a consulta.
						</DialogDescription>
					</DialogHeader>
					<RescheduleAppointmentForm
						appointment={appointment}
						setOpen={setRescheduleOpen}
					/>
				</DialogContent>
			</Dialog>

			<Dialog open={qrOpen} onOpenChange={setQrOpen}>
				<DialogContent className="sm:max-w-sm">
					<DialogHeader className="mb-2 space-y-1">
						<DialogTitle>QR Code para check-in</DialogTitle>
						<DialogDescription>
							Apresente este código ao chegar na clínica.
						</DialogDescription>
					</DialogHeader>
					<QrCodeDialog appointmentId={appointment.id} />
				</DialogContent>
			</Dialog>

			{videoActive && videoRoom && (
				<VideoRoom
					room={videoRoom}
					isProfessional={isProfessional}
					onEnd={() => setVideoActive(false)}
				/>
			)}

			<ExamsSection
				appointmentId={appointment.id}
				isPatient={can("exam:review:patient")}
				isProfessional={can("exam:manage")}
			/>

			<AnamnesisSection
				appointmentId={appointment.id}
				canEdit={can("appointment:anamnesis:save")}
				showAiHelper={can("exam:review:patient")}
			/>

			<ProntuarioSection
				appointmentId={appointment.id}
				canEdit={can("clinical-note:edit:own", {
					userId: user?.id,
					ownerId: appointment.professionalId,
				})}
			/>

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

			{isPatient &&
				appointment.status !== "CANCELED" &&
				appointment.paymentStatus !== "PAID" && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
								<CreditCard className="h-4 w-4" />
								Pagamento antecipado
							</CardTitle>
						</CardHeader>
						<CardContent className="-mt-2 flex flex-col gap-3">
							<p className="text-sm text-muted-foreground">
								{appointment.paymentStatus === "PENDING_PAYMENT"
									? "Pagamento pendente. Conclua no link abaixo."
									: "Pague antecipadamente e garanta seu atendimento."}
							</p>
							<CustomButton
								size="sm"
								className="gap-2 w-fit"
								disabled={creatingPayment}
								onClick={async () => {
									const result = await createPayment({
										appointmentId: appointment.id,
									});
									window.open(result.checkoutUrl, "_blank");
								}}
							>
								<CreditCard className="h-4 w-4" />
								{creatingPayment ? "Processando..." : "Pagar consulta"}
							</CustomButton>
						</CardContent>
					</Card>
				)}

			{appointment.paymentStatus === "PAID" && (
				<Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
					<CardContent className="py-3 flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
						<CreditCard className="h-4 w-4" />
						Pagamento confirmado
						{appointment.paymentAmount && (
							<span className="ml-auto font-medium">
								R$ {appointment.paymentAmount.toFixed(2)}
							</span>
						)}
					</CardContent>
				</Card>
			)}

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
								<CustomButton
									size="sm"
									className="gap-2"
									onClick={() => setRateOpen(true)}
								>
									<Star className="h-4 w-4" />
									Avaliar consulta
								</CustomButton>
								<Dialog open={rateOpen} onOpenChange={setRateOpen}>
									<DialogContent className="sm:max-w-md">
										<DialogHeader className="mb-2 space-y-1">
											<DialogTitle>Avaliar consulta</DialogTitle>
											<DialogDescription>
												Sua avaliação ajuda outros pacientes a escolher o
												profissional certo.
											</DialogDescription>
										</DialogHeader>
										<RateAppointmentForm
											appointment={appointment}
											setOpen={setRateOpen}
										/>
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
