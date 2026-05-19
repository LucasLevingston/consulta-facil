"use client";

import { useState } from "react";
import { toast } from "sonner";

import { CancelAppointmentForm } from "@/components/custom/forms/Appointments/CancelAppointmentForm";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	useCompleteAppointment,
	useConfirmAppointment,
} from "@/hooks/api/use-appointments";
import type { AppointmentResponse } from "@/lib/schemas/appointment.schema";

interface AppointmentActionsProps {
	appointment: AppointmentResponse;
	userRole: "PATIENT" | "DOCTOR" | "ADMIN";
}

export function AppointmentActions({ appointment, userRole }: AppointmentActionsProps) {
	const [cancelOpen, setCancelOpen] = useState(false);
	const confirm = useConfirmAppointment();
	const complete = useCompleteAppointment();

	const { status } = appointment;
	const isPatient = userRole === "PATIENT";
	const isDoctor = userRole === "DOCTOR";
	const isAdmin = userRole === "ADMIN";

	const canCancel = (isPatient || isAdmin) && (status === "PENDING" || status === "CONFIRMED");
	const canConfirm = (isDoctor || isAdmin) && status === "PENDING";
	const canComplete = (isDoctor || isAdmin) && status === "CONFIRMED";

	if (!canCancel && !canConfirm && !canComplete) return null;

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
			{canCancel && (
				<>
					<Button
						variant="ghost"
						size="sm"
						className="text-destructive hover:text-destructive/80"
						onClick={() => setCancelOpen(true)}
					>
						Cancelar
					</Button>
					<Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
						<DialogContent className="sm:max-w-md">
							<DialogHeader className="mb-4 space-y-3">
								<DialogTitle>Cancelar Consulta</DialogTitle>
								<DialogDescription>
									Tem certeza de que deseja cancelar sua consulta?
								</DialogDescription>
							</DialogHeader>
							<CancelAppointmentForm appointment={appointment} setOpen={setCancelOpen} />
						</DialogContent>
					</Dialog>
				</>
			)}
		</div>
	);
}
