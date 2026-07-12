"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PhoneCall } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { QueueCardProps } from "./QueueCard.types";
import { useCallPatient } from "./use-call-patient";

export function QueueCard({ appointment }: QueueCardProps) {
	const { mutateAsync: call, isPending } = useCallPatient();

	async function handleCall() {
		try {
			await call(appointment.id);
			toast.success(`${appointment.patientName} chamado!`);
		} catch {
			toast.error("Erro ao chamar paciente.");
		}
	}

	const checkedInAt = appointment.checkedInAt
		? new Date(appointment.checkedInAt)
		: null;

	return (
		<div className="flex items-center justify-between gap-3 rounded-lg border p-3">
			<div className="min-w-0">
				<p className="text-sm font-medium truncate">
					{appointment.patientName}
				</p>
				<div className="flex items-center gap-2 mt-0.5">
					<Badge
						variant={
							appointment.status === "IN_PROGRESS" ? "default" : "secondary"
						}
						className="text-xs"
					>
						{appointment.status === "IN_PROGRESS"
							? "Em atendimento"
							: "Aguardando"}
					</Badge>
					{checkedInAt && (
						<span className="text-xs text-muted-foreground">
							{format(checkedInAt, "HH:mm", { locale: ptBR })}
						</span>
					)}
				</div>
			</div>
			{appointment.status === "CHECKED_IN" && (
				<Button
					size="sm"
					variant="outline"
					className="gap-1.5 shrink-0"
					onClick={handleCall}
					disabled={isPending}
				>
					<PhoneCall className="h-3.5 w-3.5" />
					Chamar
				</Button>
			)}
		</div>
	);
}
