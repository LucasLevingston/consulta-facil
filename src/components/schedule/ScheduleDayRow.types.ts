import type { ProfessionalScheduleItem } from "@/features/schedule";

export interface ScheduleDayRowProps {
	row: ProfessionalScheduleItem;
	onChange: (patch: Partial<ProfessionalScheduleItem>) => void;
}
