"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { RateAppointmentForm } from "@/components/forms/Appointments/RateAppointmentForm";
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

export function AppointmentRateButton({ appointment }: Props) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button
				variant="ghost"
				size="sm"
				className="text-amber-500 hover:text-amber-400 gap-1"
				onClick={() => setOpen(true)}
			>
				<Star className="size-3.5" />
				Avaliar
			</Button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader className="mb-2 space-y-1">
						<DialogTitle>Avaliar consulta</DialogTitle>
						<DialogDescription>
							Sua avaliação ajuda outros pacientes a escolher o profissional
							certo.
						</DialogDescription>
					</DialogHeader>
					<RateAppointmentForm appointment={appointment} setOpen={setOpen} />
				</DialogContent>
			</Dialog>
		</>
	);
}
