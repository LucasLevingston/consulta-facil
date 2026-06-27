import type { Control } from "react-hook-form";
import type { AppointmentFormValues } from "@/lib/schemas/appointment/appointment-form.schema";
import type { ProfessionalResponse } from "@/lib/schemas/doctor/professional-response.schema";

export type TimeSlot = { label: string; hours: number; minutes: number };

export interface DateTimeStepProps {
	control: Control<AppointmentFormValues>;
	selectedProfessional: ProfessionalResponse | undefined;
	scheduleLoading: boolean;
	availableSlots: TimeSlot[];
	bookedTimesForDate: Set<string>;
	isQueueMode: boolean;
	isDayDisabled: (date: Date) => boolean;
	selectedDate: Date | undefined;
	selectedTime: string;
	onTimeSelect: (slot: TimeSlot) => void;
	onDateChange: () => void;
}
