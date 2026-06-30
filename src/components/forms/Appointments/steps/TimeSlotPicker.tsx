"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, Clock } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { TimeSlotPickerProps } from "./TimeSlotPicker.types";

export function TimeSlotPicker({
	selectedProfessional,
	scheduleLoading,
	availableSlots,
	bookedTimesForDate,
	selectedDate,
	selectedTime,
	onTimeSelect,
}: TimeSlotPickerProps) {
	return (
		<div className="space-y-2">
			<p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
				<Clock className="h-3.5 w-3.5" />
				Horário disponível
			</p>

			{!selectedProfessional ? (
				<p className="text-xs text-muted-foreground py-2">
					Selecione um profissional para ver os horários disponíveis.
				</p>
			) : scheduleLoading ? (
				<p className="text-xs text-muted-foreground py-2">
					Carregando horários...
				</p>
			) : !selectedDate ? (
				<p className="text-xs text-muted-foreground py-2">
					Selecione uma data para ver os horários.
				</p>
			) : availableSlots.length === 0 ? (
				<p className="text-xs text-muted-foreground py-2">
					Profissional não atende neste dia.
				</p>
			) : (
				<div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
					{availableSlots.map((slot) => {
						const booked = bookedTimesForDate.has(slot.label);
						return (
							<button
								key={slot.label}
								type="button"
								disabled={booked}
								onClick={() => !booked && onTimeSelect(slot)}
								title={booked ? "Horário já reservado" : undefined}
								className={cn(
									"rounded-xl border py-2.5 text-sm font-medium transition-all duration-150",
									booked
										? "cursor-not-allowed border-border/40 bg-muted/40 text-muted-foreground/40 line-through"
										: selectedTime === slot.label
											? "border-primary bg-primary text-primary-foreground shadow-sm"
											: "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
								)}
							>
								{slot.label}
							</button>
						);
					})}
				</div>
			)}

			{selectedDate && selectedTime && (
				<div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-2.5 text-sm">
					<Check className="h-4 w-4 text-green-500 shrink-0" />
					<span className="text-green-700 dark:text-green-400">
						{format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })} às{" "}
						{selectedTime}
					</span>
				</div>
			)}
		</div>
	);
}
