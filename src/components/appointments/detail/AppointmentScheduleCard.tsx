"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
	CalendarDays,
	ExternalLink,
	QrCode,
	RefreshCw,
	User,
	Video,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AbacGuard } from "@/components/AbacGuard";
import { CustomButton } from "@/components/custom/custom-button";
import { RescheduleAppointmentForm } from "@/components/forms/Appointments/RescheduleAppointmentForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useGenerateMeetLink } from "@/features/appointments";
import { useCreateRoom } from "@/features/video";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import type { VideoRoom } from "@/lib/schemas/video/video-room.schema";

import { QrCodeDialog } from "./QrCodeDialog";

interface Props {
	appointment: AppointmentResponse;
	isPatient: boolean;
	isProfessional: boolean;
	userId: string | undefined;
	canReschedule: boolean;
	videoRoom: VideoRoom | undefined;
	onVideoStart: (appointmentId: string) => void;
}

export function AppointmentScheduleCard({
	appointment,
	isPatient,
	isProfessional,
	userId,
	canReschedule,
	videoRoom,
	onVideoStart,
}: Props) {
	const [qrOpen, setQrOpen] = useState(false);
	const [rescheduleOpen, setRescheduleOpen] = useState(false);
	const { mutateAsync: generateMeetLink, isPending: generatingLink } =
		useGenerateMeetLink();
	const { mutateAsync: createRoom, isPending: creatingRoom } = useCreateRoom();

	const isOnline = appointment.modality === "ONLINE";
	const scheduledDate = new Date(appointment.scheduledAt);

	return (
		<>
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
												onVideoStart(appointment.id);
											} catch {
												toast.error("Erro ao iniciar teleconsulta.");
											}
										}}
									>
										<Video className="h-3.5 w-3.5" />
										{creatingRoom ? "Iniciando..." : "Iniciar teleconsulta"}
									</CustomButton>
								)}
							{isOnline && isPatient && videoRoom && (
								<CustomButton
									size="sm"
									className="gap-2"
									onClick={() => onVideoStart(appointment.id)}
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
										userId,
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
		</>
	);
}
