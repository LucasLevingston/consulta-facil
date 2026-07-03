"use client";

import { ExternalLink, Video } from "lucide-react";
import { CustomButton } from "@/components/custom/custom-button";
import type { AppointmentResponse } from "@/features/appointments";
import type { VideoRoom } from "@/features/video";

interface Props {
	appointment: AppointmentResponse;
	isOnline: boolean;
	isPatient: boolean;
	isProfessional: boolean;
	videoRoom: VideoRoom | undefined;
	onVideoStart: (appointmentId: string) => void;
	generatingLink: boolean;
	creatingRoom: boolean;
	onGenerateMeetLink: () => void;
	onStartVideoRoom: () => void;
}

export function AppointmentScheduleCardVideoActions({
	appointment,
	isOnline,
	isPatient,
	isProfessional,
	videoRoom,
	onVideoStart,
	generatingLink,
	creatingRoom,
	onGenerateMeetLink,
	onStartVideoRoom,
}: Props) {
	return (
		<>
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
					onClick={onGenerateMeetLink}
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
						onClick={onStartVideoRoom}
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
		</>
	);
}
