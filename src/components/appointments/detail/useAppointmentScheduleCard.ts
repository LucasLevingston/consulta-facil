"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useGenerateMeetLink } from "@/features/appointments";
import { useCreateRoom } from "./use-create-room";

export function useAppointmentScheduleCard(
	appointmentId: string,
	onVideoStart: (id: string) => void,
) {
	const [qrOpen, setQrOpen] = useState(false);
	const [rescheduleOpen, setRescheduleOpen] = useState(false);
	const { mutateAsync: generateMeetLink, isPending: generatingLink } =
		useGenerateMeetLink();
	const { mutateAsync: createRoom, isPending: creatingRoom } = useCreateRoom();

	async function handleStartVideoRoom() {
		try {
			await createRoom(appointmentId);
			onVideoStart(appointmentId);
		} catch {
			toast.error("Erro ao iniciar teleconsulta.");
		}
	}

	return {
		qrOpen,
		setQrOpen,
		rescheduleOpen,
		setRescheduleOpen,
		generatingLink,
		creatingRoom,
		onGenerateMeetLink: () => generateMeetLink(appointmentId),
		handleStartVideoRoom,
	};
}
