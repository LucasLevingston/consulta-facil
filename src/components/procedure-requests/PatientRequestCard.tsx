"use client";

import { Clock, DollarSign } from "lucide-react";
import { toast } from "sonner";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useCancelProcedureRequest } from "@/features/procedure-requests";
import { PatientRequestActions } from "./PatientRequestActions";
import type { PatientRequestCardProps } from "./PatientRequestCard.types";
import { StatusBadge } from "./StatusBadge";

export function PatientRequestCard({ request }: PatientRequestCardProps) {
	const { mutateAsync: cancel, isPending: canceling } =
		useCancelProcedureRequest();

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
	const canSchedule = request.status === "PENDING";

	return (
		<Card>
			<CardHeader className="pb-2">
				<div className="flex items-start justify-between gap-2">
					<div>
						<CardTitle className="text-sm font-medium">
							{request.serviceName}
						</CardTitle>
						<CardDescription>
							Profissional: {request.professionalName ?? request.professionalId}
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
				<PatientRequestActions
					requestId={request.id}
					serviceName={request.serviceName}
					canSchedule={canSchedule}
					canCancel={canCancel}
					canceling={canceling}
					onCancel={handleCancel}
				/>
			</CardContent>
		</Card>
	);
}
