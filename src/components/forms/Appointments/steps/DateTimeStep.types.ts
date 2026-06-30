import type { Control } from "react-hook-form";
import type { AppointmentFormValues } from "@/features/appointments";
import type { ProfessionalResponse } from "@/features/professionals";
import type { TimeSlot } from "@/lib/types/time-slot";

export type { TimeSlot };

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
