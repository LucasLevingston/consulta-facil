import type { ProfessionalResponse } from "@/features/professionals";
import type { TimeSlot } from "@/lib/types/time-slot";

export interface TimeSlotPickerProps {
	selectedProfessional: ProfessionalResponse | undefined;
	scheduleLoading: boolean;
	availableSlots: TimeSlot[];
	bookedTimesForDate: Set<string>;
	selectedDate: Date | undefined;
	selectedTime: string;
	onTimeSelect: (slot: TimeSlot) => void;
}
