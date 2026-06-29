"use client";

import { Clock, DollarSign, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useCancelProcedureRequest } from "@/features/procedure-requests";
import type { ProcedureRequest } from "@/lib/schemas/procedure-request/procedure-request.schema";
import { StatusBadge } from "./StatusBadge";

export function ProfessionalRequestCard({
	request,
}: {
	request: ProcedureRequest;
}) {
	const { mutateAsync: cancel, isPending } = useCancelProcedureRequest();

	async function handleCancel() {
		try {
			await cancel(request.id);
			toast.success("Solicitação cancelada.");
		} catch {
			toast.error("Erro ao cancelar solicitação.");
		}
	}

	const canCancel =
		request.status === "PENDING" || request.status === "SCHEDULED";

	return (
		<Card>
			<CardHeader className="pb-2">
				<div className="flex items-start justify-between gap-2">
					<div>
						<CardTitle className="text-sm font-medium">
							{request.serviceName}
						</CardTitle>
						<CardDescription>
							Paciente: {request.patientName ?? request.patientId}
						</CardDescription>
					</div>
					<StatusBadge status={request.status} />
				</div>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="flex items-center gap-4 text-xs text-muted-foreground">
					<span className="flex items-center gap-1">
						<DollarSign className="h-3 w-3" />
						R$ {request.servicePrice.toFixed(2)}
					</span>
					<span className="flex items-center gap-1">
						<Clock className="h-3 w-3" />
						{request.serviceDurationMinutes} min
					</span>
				</div>
				{request.notes && (
					<p className="text-xs text-muted-foreground">{request.notes}</p>
				)}
				{canCancel && (
					<div className="flex justify-end">
						<Button
							variant="ghost"
							size="sm"
							className="text-destructive h-8"
							onClick={handleCancel}
							disabled={isPending}
						>
							<X className="h-3 w-3 mr-1" />
							Cancelar
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
