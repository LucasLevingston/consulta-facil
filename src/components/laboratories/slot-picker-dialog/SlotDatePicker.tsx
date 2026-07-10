"use client";

import { ptBR } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";

interface Props {
	selectedDate: Date | undefined;
	onSelect: (d: Date | undefined) => void;
}

export function SlotDatePicker({ selectedDate, onSelect }: Props) {
	return (
		<div className="space-y-2">
			<p className="text-sm font-medium flex items-center gap-1.5">
				<Calendar className="h-4 w-4 text-muted-foreground" />
				Escolha a data
			</p>
			<div className="flex justify-center">
				<CalendarPicker
					mode="single"
					selected={selectedDate}
					onSelect={onSelect}
					disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
					locale={ptBR}
					className="rounded-xl border"
				/>
			</div>
		</div>
	);
}
