"use client";

import { CalendarClock, Clock, DollarSign, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { ProcedureRequest } from "@/features/procedure-requests";
import { useCancelProcedureRequest } from "@/features/procedure-requests";
import { ScheduleProcedureRequestForm } from "./ScheduleProcedureRequestForm";
import { StatusBadge } from "./StatusBadge";

export function PatientRequestCard({ request }: { request: ProcedureRequest }) {
	const { mutateAsync: cancel, isPending: canceling } =
		useCancelProcedureRequest();
	const [scheduleOpen, setScheduleOpen] = useState(false);

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
				{(canSchedule || canCancel) && (
					<div className="flex justify-end gap-2">
						{canSchedule && (
							<Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
								<DialogTrigger asChild>
									<Button size="sm" className="h-8">
										<CalendarClock className="h-3 w-3 mr-1" />
										Agendar
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Agendar procedimento</DialogTitle>
									</DialogHeader>
									<ScheduleProcedureRequestForm
										requestId={request.id}
										serviceName={request.serviceName}
										onClose={() => setScheduleOpen(false)}
									/>
								</DialogContent>
							</Dialog>
						)}
						{canCancel && (
							<Button
								variant="ghost"
								size="sm"
								className="text-destructive h-8"
								onClick={handleCancel}
								disabled={canceling}
							>
								<X className="h-3 w-3 mr-1" />
								Cancelar
							</Button>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
