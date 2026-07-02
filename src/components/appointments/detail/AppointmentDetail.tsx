"use client";

import { useState } from "react";
import { VideoRoom } from "@/components/custom/VideoRoom";
import { ExamsSection } from "@/components/forms/Appointments/ExamsSection";
import { usePermission, useUserStore } from "@/features/auth";
import { useRoomToken } from "@/features/video";
import { AnamnesisSection } from "./AnamnesisSection";
import { AppointmentCancellationCard } from "./AppointmentCancellationCard";
import type { AppointmentDetailProps } from "./AppointmentDetail.types";
import { AppointmentHeader } from "./AppointmentHeader";
import { AppointmentPaymentSection } from "./AppointmentPaymentSection";
import { AppointmentProfessionalCard } from "./AppointmentProfessionalCard";
import { AppointmentRatingSection } from "./AppointmentRatingSection";
import { AppointmentScheduleCard } from "./AppointmentScheduleCard";
import { ProntuarioSection } from "./ProntuarioSection";

export function AppointmentDetail({ appointment }: AppointmentDetailProps) {
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
				<AppointmentCancellationCard reason={appointment.cancellationReason} />
			)}
			{isPatient && <AppointmentPaymentSection appointment={appointment} />}
			<AppointmentRatingSection appointment={appointment} canRate={canRate} />
		</div>
	);
}
