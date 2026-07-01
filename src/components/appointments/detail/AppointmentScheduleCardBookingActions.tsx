"use client";

import { QrCode, RefreshCw } from "lucide-react";
import { AbacGuard } from "@/components/AbacGuard";
import { CustomButton } from "@/components/custom/custom-button";
import type { AppointmentResponse } from "@/features/appointments";

interface Props {
	appointment: AppointmentResponse;
	isOnline: boolean;
	isPatient: boolean;
	canReschedule: boolean;
	userId: string | undefined;
	onQrOpen: () => void;
	onRescheduleOpen: () => void;
}

export function AppointmentScheduleCardBookingActions({
	appointment,
	isOnline,
	isPatient,
	canReschedule,
	userId,
	onQrOpen,
	onRescheduleOpen,
}: Props) {
	return (
		<>
			{isPatient && appointment.status === "CONFIRMED" && !isOnline && (
				<CustomButton
					variant="outline"
					size="sm"
					className="gap-2"
					onClick={onQrOpen}
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
						onClick={onRescheduleOpen}
					>
						<RefreshCw className="h-3.5 w-3.5" />
						Remarcar
					</CustomButton>
				</AbacGuard>
			)}
		</>
	);
}
