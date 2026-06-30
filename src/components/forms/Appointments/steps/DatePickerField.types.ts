import type { Control } from "react-hook-form";
import type { AppointmentFormValues } from "@/features/appointments";

export interface DatePickerFieldProps {
	control: Control<AppointmentFormValues>;
	isQueueMode: boolean;
	isDayDisabled: (date: Date) => boolean;
	onDateChange: () => void;
}
