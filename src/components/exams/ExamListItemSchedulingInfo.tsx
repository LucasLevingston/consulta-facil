"use client";

import { CalendarClock, MapPin, Phone } from "lucide-react";
import type { ExamRequestResponse } from "@/features/exams";

interface Props {
	exam: ExamRequestResponse;
}

export function ExamListItemSchedulingInfo({ exam }: Props) {
	return (
		<div className="rounded-lg bg-muted/50 p-3 space-y-1.5">
			<p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
				<CalendarClock className="h-3 w-3" />
				Agendamento
			</p>
			{exam.scheduledAt && (
				<p className="text-sm">
					{new Date(exam.scheduledAt).toLocaleString("pt-BR", {
						dateStyle: "long",
						timeStyle: "short",
					})}
				</p>
			)}
			<p className="text-sm font-medium">{exam.labName}</p>
			{exam.labAddress && (
				<p className="text-xs text-muted-foreground flex items-center gap-1">
					<MapPin className="h-3 w-3 shrink-0" />
					{exam.labAddress}
				</p>
			)}
			{exam.labPhone && (
				<p className="text-xs text-muted-foreground flex items-center gap-1">
					<Phone className="h-3 w-3 shrink-0" />
					{exam.labPhone}
				</p>
			)}
		</div>
	);
}
