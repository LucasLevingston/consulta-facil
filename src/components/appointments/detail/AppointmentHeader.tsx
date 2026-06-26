"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CustomButton } from "@/components/custom/custom-button";
import { Badge } from "@/components/ui/badge";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import { STATUS_CONFIG } from "@/utils/constants/appointment-status-config";

interface Props {
	appointment: AppointmentResponse;
}

export function AppointmentHeader({ appointment }: Props) {
	const statusConfig = STATUS_CONFIG[appointment.status];
	const scheduledDate = new Date(appointment.scheduledAt);

	return (
		<>
			<div className="flex items-center gap-3">
				<CustomButton variant="ghost" size="sm" className="gap-2 -ml-2" asChild>
					<Link href="/dashboard/appointments">
						<ArrowLeft className="h-4 w-4" />
						Voltar
					</Link>
				</CustomButton>
			</div>

			<div className="flex items-start justify-between gap-4">
				<div>
					<h1 className="text-xl font-bold text-foreground">
						Detalhes da consulta
					</h1>
					<p className="text-sm text-muted-foreground mt-0.5">
						{format(scheduledDate, "EEEE, dd 'de' MMMM 'de' yyyy", {
							locale: ptBR,
						})}
					</p>
				</div>
				<Badge variant={statusConfig.variant} className="shrink-0">
					{statusConfig.label}
				</Badge>
			</div>
		</>
	);
}
