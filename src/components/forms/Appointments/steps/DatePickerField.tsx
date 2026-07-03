"use client";

import { format, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

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
import type { DatePickerFieldProps } from "./DatePickerField.types";

export function DatePickerField({
	control,
	isQueueMode,
	isDayDisabled,
	onDateChange,
}: DatePickerFieldProps) {
	return (
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
							<PopoverContent className="w-auto p-0 rounded-2xl" align="start">
								<Calendar
									mode="single"
									selected={field.value}
									onSelect={(date) => {
										if (!date) return;
										onDateChange();
										field.onChange(
											isQueueMode ? setMinutes(setHours(date, 9), 0) : date,
										);
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
	);
}
