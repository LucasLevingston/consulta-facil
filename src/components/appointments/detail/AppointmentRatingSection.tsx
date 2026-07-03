"use client";

import { MessageSquare, Star } from "lucide-react";
import { useState } from "react";
import { CustomButton } from "@/components/custom/custom-button";
import { RateAppointmentForm } from "@/components/forms/Appointments/RateAppointmentForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { AppointmentRatingSectionProps } from "./AppointmentRatingSection.types";
import { StarDisplay } from "./StarDisplay";

export function AppointmentRatingSection({
	appointment,
	canRate,
}: AppointmentRatingSectionProps) {
	const [rateOpen, setRateOpen] = useState(false);

	if (appointment.status !== "COMPLETED") return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
					<MessageSquare className="h-4 w-4" />
					Avaliação
				</CardTitle>
			</CardHeader>
			<CardContent className="-mt-2">
				{appointment.rating != null ? (
					<div className="space-y-2">
						<StarDisplay rating={appointment.rating} />
						{appointment.ratingComment && (
							<p className="text-sm text-muted-foreground italic">
								&ldquo;{appointment.ratingComment}&rdquo;
							</p>
						)}
					</div>
				) : canRate ? (
					<div className="flex flex-col items-start gap-3">
						<p className="text-sm text-muted-foreground">
							Você ainda não avaliou esta consulta.
						</p>
						<CustomButton
							size="sm"
							className="gap-2"
							onClick={() => setRateOpen(true)}
						>
							<Star className="h-4 w-4" />
							Avaliar consulta
						</CustomButton>
						<Dialog open={rateOpen} onOpenChange={setRateOpen}>
							<DialogContent className="sm:max-w-md">
								<DialogHeader className="mb-2 space-y-1">
									<DialogTitle>Avaliar consulta</DialogTitle>
									<DialogDescription>
										Sua avaliação ajuda outros pacientes a escolher o
										profissional certo.
									</DialogDescription>
								</DialogHeader>
								<RateAppointmentForm
									appointment={appointment}
									setOpen={setRateOpen}
								/>
							</DialogContent>
						</Dialog>
					</div>
				) : (
					<p className="text-sm text-muted-foreground">Sem avaliação.</p>
				)}
			</CardContent>
		</Card>
	);
}
