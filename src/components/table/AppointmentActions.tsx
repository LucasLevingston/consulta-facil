"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { CancelAppointmentForm } from "@/components/forms/Appointments/CancelAppointmentForm";
import { RateAppointmentForm } from "@/components/forms/Appointments/RateAppointmentForm";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useCompleteAppointment } from "@/hooks/api/appointments/use-complete-appointment";
import { useConfirmAppointment } from "@/hooks/api/appointments/use-confirm-appointment";
import type { AppointmentResponse } from "@/lib/schemas/appointment.schema";

interface AppointmentActionsProps {
	appointment: AppointmentResponse;
	userRole: "PATIENT" | "PROFESSIONAL" | "ADMIN";
}

export function AppointmentActions({
	appointment,
	userRole,
}: AppointmentActionsProps) {
	const [cancelOpen, setCancelOpen] = useState(false);
	const [rateOpen, setRateOpen] = useState(false);
	const confirm = useConfirmAppointment();
	const complete = useCompleteAppointment();

	const { status } = appointment;
	const isPatient = userRole === "PATIENT";
	const isDoctor = userRole === "PROFESSIONAL";
	const isAdmin = userRole === "ADMIN";

	const canCancel =
		(isPatient || isAdmin) && (status === "PENDING" || status === "CONFIRMED");
	const canConfirm = (isDoctor || isAdmin) && status === "PENDING";
	const canComplete =
		(isDoctor || isAdmin) &&
		(status === "CONFIRMED" || status === "IN_PROGRESS");
	const canRate =
		isPatient && status === "COMPLETED" && appointment.rating == null;

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
			{canRate && (
				<>
					<Button
						variant="ghost"
						size="sm"
						className="text-amber-500 hover:text-amber-400 gap-1"
						onClick={() => setRateOpen(true)}
					>
						<Star className="size-3.5" />
						Avaliar
					</Button>
					<Dialog open={rateOpen} onOpenChange={setRateOpen}>
						<DialogContent className="sm:max-w-md">
							<DialogHeader className="mb-2 space-y-1">
								<DialogTitle>Avaliar consulta</DialogTitle>
								<DialogDescription>
									Sua avaliação ajuda outros pacientes a escolher o profissional
									certo.
								</DialogDescription>
							</DialogHeader>
							<RateAppointmentForm
								appointment={appointment}
								setOpen={setRateOpen}
							/>
						</DialogContent>
					</Dialog>
				</>
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
							<CancelAppointmentForm
								appointment={appointment}
								setOpen={setCancelOpen}
							/>
						</DialogContent>
					</Dialog>
				</>
			)}
		</div>
	);
}
