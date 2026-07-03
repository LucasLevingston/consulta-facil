"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppointmentResponse } from "@/features/appointments";
import { SPECIALTY_LABELS } from "@/utils/constants/profession-specialties";
import { formatBRL } from "@/utils/format-brl";

interface Props {
	appointments: AppointmentResponse[];
}

export function FinancialRecentPayments({ appointments }: Props) {
	const recentPaid = useMemo(
		() =>
			appointments
				.filter((a) => a.paymentStatus === "PAID")
				.sort(
					(a, b) =>
						new Date(b.scheduledAt).getTime() -
						new Date(a.scheduledAt).getTime(),
				)
				.slice(0, 5),
		[appointments],
	);

	return (
		<Card className="border-border bg-card">
			<CardHeader className="pb-2">
				<CardTitle className="text-base font-semibold">
					Últimas consultas pagas
				</CardTitle>
			</CardHeader>
			<CardContent>
				{recentPaid.length === 0 ? (
					<p className="py-6 text-center text-sm text-muted-foreground">
						Nenhuma consulta paga encontrada.
					</p>
				) : (
					<div className="space-y-3">
						{recentPaid.map((a) => (
							<div
								key={a.id}
								className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 px-4 py-3"
							>
								<div>
									<p className="text-sm font-medium text-foreground">
										{a.patientName ?? "Paciente"}
									</p>
									<p className="text-xs text-muted-foreground">
										{format(new Date(a.scheduledAt), "dd/MM/yyyy 'às' HH:mm", {
											locale: ptBR,
										})}
									</p>
								</div>
								<div className="flex items-center gap-3">
									{a.specialty && (
										<Badge
											variant="secondary"
											className="hidden text-xs sm:inline-flex"
										>
											{SPECIALTY_LABELS[a.specialty] ?? a.specialty}
										</Badge>
									)}
									<span className="font-semibold text-green-600 text-sm">
										{formatBRL(a.paymentAmount ?? 0)}
									</span>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
