"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, Users } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { DatePickerField } from "./DatePickerField";
import type { DateTimeStepProps } from "./DateTimeStep.types";
import { TimeSlotPicker } from "./TimeSlotPicker";

export type { TimeSlot } from "./DateTimeStep.types";

export function DateTimeStep({
	control,
	selectedProfessional,
	scheduleLoading,
	availableSlots,
	bookedTimesForDate,
	isQueueMode,
	isDayDisabled,
	selectedDate,
	selectedTime,
	onTimeSelect,
	onDateChange,
}: DateTimeStepProps) {
	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
					3
				</div>
				<h3 className="font-semibold text-foreground">Data e horário</h3>
			</div>

			<DatePickerField
				control={control}
				isQueueMode={isQueueMode}
				isDayDisabled={isDayDisabled}
				onDateChange={onDateChange}
			/>

			{isQueueMode ? (
				<>
					<Alert className="rounded-xl border-blue-500/20 bg-blue-500/5">
						<Users className="h-4 w-4 text-blue-500" />
						<AlertDescription className="text-xs text-blue-700 dark:text-blue-400">
							Este profissional usa sistema de fila. Selecione uma data e você
							será atendido por ordem de chegada.
						</AlertDescription>
					</Alert>
					{selectedDate && (
						<div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-2.5 text-sm">
							<Check className="h-4 w-4 text-green-500 shrink-0" />
							<span className="text-green-700 dark:text-green-400">
								{format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })} —
								entrada na fila
							</span>
						</div>
					)}
				</>
			) : (
				<TimeSlotPicker
					selectedProfessional={selectedProfessional}
					scheduleLoading={scheduleLoading}
					availableSlots={availableSlots}
					bookedTimesForDate={bookedTimesForDate}
					selectedDate={selectedDate}
					selectedTime={selectedTime}
					onTimeSelect={onTimeSelect}
				/>
			)}
		</div>
	);
}
