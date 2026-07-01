"use client";

import { CalendarDays } from "lucide-react";
import { RescheduleAppointmentForm } from "@/components/forms/Appointments/RescheduleAppointmentForm";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { AppointmentScheduleCardProps } from "./AppointmentScheduleCard.types";
import { AppointmentScheduleCardBookingActions } from "./AppointmentScheduleCardBookingActions";
import { AppointmentScheduleCardInfo } from "./AppointmentScheduleCardInfo";
import { AppointmentScheduleCardVideoActions } from "./AppointmentScheduleCardVideoActions";
import { QrCodeDialog } from "./QrCodeDialog";
import { useAppointmentScheduleCard } from "./useAppointmentScheduleCard";

export function AppointmentScheduleCard({
	appointment,
	isPatient,
	isProfessional,
	userId,
	canReschedule,
	videoRoom,
	onVideoStart,
}: AppointmentScheduleCardProps) {
	const card = useAppointmentScheduleCard(appointment.id, onVideoStart);
	const isOnline = appointment.modality === "ONLINE";

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
							<AppointmentScheduleCardVideoActions
								appointment={appointment}
								isOnline={isOnline}
								isPatient={isPatient}
								isProfessional={isProfessional}
								videoRoom={videoRoom}
								onVideoStart={onVideoStart}
								generatingLink={card.generatingLink}
								creatingRoom={card.creatingRoom}
								onGenerateMeetLink={card.onGenerateMeetLink}
								onStartVideoRoom={card.handleStartVideoRoom}
							/>
							<AppointmentScheduleCardBookingActions
								appointment={appointment}
								isOnline={isOnline}
								isPatient={isPatient}
								canReschedule={canReschedule}
								userId={userId}
								onQrOpen={() => card.setQrOpen(true)}
								onRescheduleOpen={() => card.setRescheduleOpen(true)}
							/>
						</div>
					</div>
				</CardHeader>
				<AppointmentScheduleCardInfo
					appointment={appointment}
					isOnline={isOnline}
					isProfessional={isProfessional}
				/>
			</Card>
			<Dialog open={card.rescheduleOpen} onOpenChange={card.setRescheduleOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader className="mb-2 space-y-1">
						<DialogTitle>Remarcar consulta</DialogTitle>
						<DialogDescription>
							Selecione a nova data e horário para a consulta.
						</DialogDescription>
					</DialogHeader>
					<RescheduleAppointmentForm
						appointment={appointment}
						setOpen={card.setRescheduleOpen}
					/>
				</DialogContent>
			</Dialog>

			<Dialog open={card.qrOpen} onOpenChange={card.setQrOpen}>
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
