"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, User } from "lucide-react";
import Link from "next/link";
import { CustomButton } from "@/components/custom/custom-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { PatientSummary } from "@/lib/api/patients/patient-profile.api.types";

interface Props {
	patients: PatientSummary[];
}

export function PatientsGrid({ patients }: Props) {
	if (patients.length === 0) {
		return (
			<div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-border">
				<p className="text-sm text-muted-foreground">
					Nenhum paciente encontrado.
				</p>
			</div>
		);
	}

	return (
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{patients.map((p) => (
				<Card
					key={p.id}
					className="border-border transition-shadow hover:shadow-md"
				>
					<CardContent className="p-5">
						<div className="flex items-start gap-4">
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
								<User className="h-5 w-5 text-primary" />
							</div>
							<div className="min-w-0 flex-1">
								<p className="truncate font-semibold text-foreground">
									{p.name}
								</p>
								<div className="mt-1.5 flex flex-wrap gap-2">
									<Badge variant="secondary" className="gap-1 text-xs">
										<CalendarDays className="h-3 w-3" />
										{p.totalAppointments}{" "}
										{p.totalAppointments === 1 ? "consulta" : "consultas"}
									</Badge>
								</div>
								<p className="mt-2 text-xs text-muted-foreground">
									Última:{" "}
									{format(new Date(p.lastAppointment), "dd/MM/yyyy", {
										locale: ptBR,
									})}
								</p>
							</div>
						</div>
						<div className="mt-4 flex gap-2">
							<CustomButton asChild>
								<Link href={`/dashboard/patients/${p.id}`}>
									<User />
									Ver perfil
								</Link>
							</CustomButton>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
