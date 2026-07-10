"use client";

import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import type { ExamLabResponse } from "@/features/exams";
import { cn } from "@/lib/utils/cn";

const DAY_LABELS: Record<string, string> = {
	MONDAY: "Seg",
	TUESDAY: "Ter",
	WEDNESDAY: "Qua",
	THURSDAY: "Qui",
	FRIDAY: "Sex",
	SATURDAY: "Sáb",
	SUNDAY: "Dom",
};

type Hours = NonNullable<ExamLabResponse["hours"]>;

interface Props {
	sortedHours: Hours;
	openDays: number;
	showHours: boolean;
	onToggle: () => void;
}

export function LabCardHours({
	sortedHours,
	openDays,
	showHours,
	onToggle,
}: Props) {
	function formatTime(time: string) {
		return time.slice(0, 5);
	}

	return (
		<div>
			<button
				type="button"
				onClick={onToggle}
				aria-expanded={showHours}
				className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer min-h-[36px]"
			>
				<Clock className="h-3.5 w-3.5 shrink-0" />
				{openDays > 0 ? `Aberto ${openDays}x por semana` : "Ver horários"}
				{showHours ? (
					<ChevronUp className="h-3 w-3" />
				) : (
					<ChevronDown className="h-3 w-3" />
				)}
			</button>
			{showHours && (
				<div className="mt-2 rounded-xl border bg-muted/40 p-3 space-y-1.5">
					{sortedHours.map((h) => (
						<div
							key={h.dayOfWeek}
							className={cn(
								"flex justify-between text-xs",
								h.isOpen
									? "text-foreground"
									: "text-muted-foreground opacity-50",
							)}
						>
							<span className="font-medium w-8 shrink-0">
								{DAY_LABELS[h.dayOfWeek] ?? h.dayOfWeek}
							</span>
							<span>
								{h.isOpen
									? `${formatTime(h.openTime)} – ${formatTime(h.closeTime)}`
									: "Fechado"}
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
