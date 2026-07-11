"use client";

import { toast } from "sonner";
import { usePermission } from "@/components/auth/hooks";
import { Button } from "@/components/ui/button";
import {
	useCompleteAppointment,
	useConfirmAppointment,
} from "@/features/appointments";
import { useUserStore } from "@/features/auth";
import type { AppointmentActionsProps } from "./AppointmentActions.types";
import { AppointmentCancelButton } from "./AppointmentCancelButton";
import { AppointmentRateButton } from "./AppointmentRateButton";

export function AppointmentActions({ appointment }: AppointmentActionsProps) {
	const confirm = useConfirmAppointment();
	const complete = useCompleteAppointment();
	const { can } = usePermission();
	const { user } = useUserStore();

	const { status } = appointment;

	const canCancel =
		can("appointment:cancel:own", {
			userId: user?.id,
			ownerId: appointment.patientId,
		}) &&
		(status === "PENDING" || status === "CONFIRMED");
	const canConfirm = can("appointment:confirm") && status === "PENDING";
	const canComplete =
		can("appointment:complete") &&
		(status === "CONFIRMED" || status === "IN_PROGRESS");
	const canRate =
		can("appointment:rate") &&
		status === "COMPLETED" &&
		appointment.rating == null;

	if (!canCancel && !canConfirm && !canComplete && !canRate) return null;

	const handleConfirm = async () => {
		try {
			await confirm.mutateAsync(appointment.id);
		} catch {
			toast.error("Erro ao confirmar consulta.");
		}
	};

	const handleComplete = async () => {
		try {
			await complete.mutateAsync(appointment.id);
		} catch {
			toast.error("Erro ao concluir consulta.");
		}
	};

	return (
		<div className="flex gap-1">
			{canConfirm && (
				<Button
					variant="ghost"
					size="sm"
					className="text-green-500 hover:text-green-400"
					disabled={confirm.isPending}
					onClick={handleConfirm}
				>
					{confirm.isPending ? "..." : "Confirmar"}
				</Button>
			)}
			{canComplete && (
				<Button
					variant="ghost"
					size="sm"
					className="text-blue-500 hover:text-blue-400"
					disabled={complete.isPending}
					onClick={handleComplete}
				>
					{complete.isPending ? "..." : "Concluir"}
				</Button>
			)}
			{canRate && <AppointmentRateButton appointment={appointment} />}
			{canCancel && <AppointmentCancelButton appointment={appointment} />}
		</div>
	);
}
