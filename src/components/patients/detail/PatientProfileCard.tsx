"use client";

import { CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { PatientProfile } from "@/features/patients";

interface Props {
	patient: PatientProfile;
	initials: string;
	appointmentsCount: number;
}

export function PatientProfileCard({
	patient,
	initials,
	appointmentsCount,
}: Props) {
	return (
		<Card className="overflow-hidden">
			<div className="h-24 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20" />
			<CardContent className="relative pt-0 pb-6 px-6">
				<div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<Avatar className="size-20 rounded-2xl border-4 border-card shadow-md">
						<AvatarImage
							src={patient.imageUrl ?? undefined}
							alt={patient.name ?? "Paciente"}
						/>
						<AvatarFallback className="rounded-2xl bg-primary/15 text-primary font-bold text-2xl">
							{initials}
						</AvatarFallback>
					</Avatar>
					<div className="flex gap-2 shrink-0">
						<Badge variant="secondary" className="gap-1.5">
							<CalendarDays className="h-3 w-3" />
							{appointmentsCount}{" "}
							{appointmentsCount === 1 ? "consulta" : "consultas"}
						</Badge>
					</div>
				</div>
				<div className="mt-4">
					<h1 className="text-2xl font-bold">{patient.name}</h1>
					{patient.occupation && (
						<p className="text-sm text-muted-foreground mt-0.5">
							{patient.occupation}
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
