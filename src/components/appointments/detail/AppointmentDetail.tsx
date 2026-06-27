"use client";

import { XCircle } from "lucide-react";
import { useState } from "react";
import { VideoRoom } from "@/components/custom/VideoRoom";
import { ExamsSection } from "@/components/forms/Appointments/ExamsSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRoomToken } from "@/hooks/api/video/use-room-token";
import { usePermission } from "@/hooks/use-permission";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import { useUserStore } from "@/store/useUserStore";

import { AnamnesisSection } from "./AnamnesisSection";
import { AppointmentHeader } from "./AppointmentHeader";
import { AppointmentPaymentSection } from "./AppointmentPaymentSection";
import { AppointmentProfessionalCard } from "./AppointmentProfessionalCard";
import { AppointmentRatingSection } from "./AppointmentRatingSection";
import { AppointmentScheduleCard } from "./AppointmentScheduleCard";
import { ProntuarioSection } from "./ProntuarioSection";

export function AppointmentDetail({
	appointment,
}: {
	appointment: AppointmentResponse;
}) {
	const { user } = useUserStore();
	const { can } = usePermission();
	const [videoActive, setVideoActive] = useState(false);
	const [videoAppointmentId, setVideoAppointmentId] = useState<string | null>(
		null,
	);
	const { data: videoRoom } = useRoomToken(videoAppointmentId);

	const role = user?.role ?? "PATIENT";
	const isPatient = role === "PATIENT";
	const isProfessional = role === "PROFESSIONAL" || role === "ADMIN";
	const canRate =
		isPatient &&
		appointment.status === "COMPLETED" &&
		appointment.rating == null;
	const canReschedule =
		appointment.status === "PENDING" || appointment.status === "CONFIRMED";

	function handleVideoStart(appointmentId: string) {
		setVideoAppointmentId(appointmentId);
		setVideoActive(true);
	}

	return (
		<div className="mx-auto max-w-2xl space-y-6">
			<AppointmentHeader appointment={appointment} />

			<AppointmentProfessionalCard appointment={appointment} />

			<AppointmentScheduleCard
				appointment={appointment}
				isPatient={isPatient}
				isProfessional={isProfessional}
				userId={user?.id}
				canReschedule={canReschedule}
				videoRoom={videoRoom}
				onVideoStart={handleVideoStart}
			/>

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

			{isPatient && <AppointmentPaymentSection appointment={appointment} />}

			<AppointmentRatingSection appointment={appointment} canRate={canRate} />
		</div>
	);
}
