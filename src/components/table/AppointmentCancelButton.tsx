"use client";

import { useState } from "react";
import { CancelAppointmentForm } from "@/components/forms/Appointments/CancelAppointmentForm";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { AppointmentResponse } from "@/features/appointments";

interface Props {
	appointment: AppointmentResponse;
}

export function AppointmentCancelButton({ appointment }: Props) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button
				variant="ghost"
				size="sm"
				className="text-destructive hover:text-destructive/80"
				onClick={() => setOpen(true)}
			>
				Cancelar
			</Button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader className="mb-4 space-y-3">
						<DialogTitle>Cancelar Consulta</DialogTitle>
						<DialogDescription>
							Tem certeza de que deseja cancelar sua consulta?
						</DialogDescription>
					</DialogHeader>
					<CancelAppointmentForm appointment={appointment} setOpen={setOpen} />
				</DialogContent>
			</Dialog>
		</>
	);
}
