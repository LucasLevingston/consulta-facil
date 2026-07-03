"use client";

import { Stethoscope } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";
import type { AppointmentProfessionalCardProps } from "./AppointmentProfessionalCard.types";

export function AppointmentProfessionalCard({
	appointment,
}: AppointmentProfessionalCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
					<Stethoscope className="h-4 w-4" />
					Profissional
				</CardTitle>
			</CardHeader>
			<CardContent className="flex items-center gap-4 -mt-2">
				<Avatar className="h-12 w-12 shrink-0">
					<AvatarImage alt={appointment.professionalName ?? ""} />
					<AvatarFallback>
						{(appointment.professionalName ?? "?")[0]}
					</AvatarFallback>
				</Avatar>
				<div>
					<p className="font-semibold">{appointment.professionalName}</p>
					{appointment.specialty && (
						<p className="text-sm text-muted-foreground">
							{SPECIALTY_LABELS[appointment.specialty] ?? appointment.specialty}
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
