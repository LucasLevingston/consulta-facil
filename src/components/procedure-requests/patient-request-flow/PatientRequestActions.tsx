"use client";

import { CalendarClock, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ScheduleProcedureRequestForm } from "./ScheduleProcedureRequestForm";

interface Props {
	requestId: string;
	serviceName: string;
	canSchedule: boolean;
	canCancel: boolean;
	canceling: boolean;
	onCancel: () => void;
}

export function PatientRequestActions({
	requestId,
	serviceName,
	canSchedule,
	canCancel,
	canceling,
	onCancel,
}: Props) {
	const [scheduleOpen, setScheduleOpen] = useState(false);
	if (!canSchedule && !canCancel) return null;
	return (
		<div className="flex justify-end gap-2">
			{canSchedule && (
				<Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
					<DialogTrigger asChild>
						<Button size="sm" className="h-8">
							<CalendarClock className="mr-1 h-3 w-3" />
							Agendar
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Agendar procedimento</DialogTitle>
						</DialogHeader>
						<ScheduleProcedureRequestForm
							requestId={requestId}
							serviceName={serviceName}
							onClose={() => setScheduleOpen(false)}
						/>
					</DialogContent>
				</Dialog>
			)}
			{canCancel && (
				<Button
					variant="ghost"
					size="sm"
					className="h-8 text-destructive"
					onClick={onCancel}
					disabled={canceling}
				>
					<X className="mr-1 h-3 w-3" />
					Cancelar
				</Button>
			)}
		</div>
	);
}
