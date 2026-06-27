"use client";

import { format, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Check, Clock, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils/cn";
import type { DateTimeStepProps } from "./DateTimeStep.types";

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

			<FormField
				control={control}
				name="scheduledAt"
				render={({ field }) => (
					<FormItem>
						<FormControl>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										type="button"
										variant="outline"
										className={cn(
											"w-full justify-start rounded-xl border-border h-11 px-4",
											!field.value && "text-muted-foreground",
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
										{field.value
											? format(field.value, "EEEE, d 'de' MMMM 'de' yyyy", {
													locale: ptBR,
												})
											: "Selecione uma data"}
									</Button>
								</PopoverTrigger>
								<PopoverContent
									className="w-auto p-0 rounded-2xl"
									align="start"
								>
									<Calendar
										mode="single"
										selected={field.value}
										onSelect={(date) => {
											if (!date) return;
											onDateChange();
											if (isQueueMode) {
												field.onChange(setMinutes(setHours(date, 9), 0));
											} else {
												field.onChange(date);
											}
										}}
										disabled={isDayDisabled}
										locale={ptBR}
									/>
								</PopoverContent>
							</Popover>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
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
				<>
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
					</div>

					{selectedDate && selectedTime && (
						<div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-2.5 text-sm">
							<Check className="h-4 w-4 text-green-500 shrink-0" />
							<span className="text-green-700 dark:text-green-400">
								{format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })} às{" "}
								{selectedTime}
							</span>
						</div>
					)}
				</>
			)}
		</div>
	);
}
