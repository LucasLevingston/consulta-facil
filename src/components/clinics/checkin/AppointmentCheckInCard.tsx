"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle2, Loader2, Stethoscope } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCheckInByQr } from "@/hooks/api/appointments/use-check-in-by-qr";
import { useCheckInToken } from "@/hooks/api/appointments/use-check-in-token";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";

export function AppointmentCheckInCard({
	appointment,
}: {
	appointment: AppointmentResponse;
}) {
	const [done, setDone] = useState(false);
	const { data: tokenData, isLoading: tokenLoading } = useCheckInToken(
		appointment.id,
	);
	const { mutateAsync: checkIn, isPending } = useCheckInByQr();

	async function handleCheckIn() {
		if (!tokenData?.token) return;
		try {
			await checkIn(tokenData.token);
			setDone(true);
			toast.success("Check-in realizado! Você está na fila.");
		} catch {
			toast.error("Erro ao fazer check-in. Tente novamente.");
		}
	}

	return (
		<Card className={`border-border ${done ? "opacity-60" : ""}`}>
			<CardContent className="flex items-center gap-4 p-4">
				<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
					<Stethoscope className="h-5 w-5 text-primary" />
				</div>
				<div className="flex-1 min-w-0">
					<p className="font-semibold text-foreground">
						{appointment.professionalName ?? "Profissional"}
					</p>
					{appointment.specialty && (
						<p className="text-xs text-muted-foreground">
							{appointment.specialty}
						</p>
					)}
					<p className="text-xs text-muted-foreground mt-0.5">
						{format(new Date(appointment.scheduledAt), "HH:mm", {
							locale: ptBR,
						})}
					</p>
				</div>
				{done ? (
					<Badge
						variant="outline"
						className="gap-1 text-green-600 border-green-300 bg-green-50"
					>
						<CheckCircle2 className="h-3.5 w-3.5" />
						Na fila
					</Badge>
				) : (
					<Button
						size="sm"
						onClick={handleCheckIn}
						disabled={isPending || tokenLoading || !tokenData?.token}
					>
						{isPending ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							"Check-in"
						)}
					</Button>
				)}
			</CardContent>
		</Card>
	);
}
