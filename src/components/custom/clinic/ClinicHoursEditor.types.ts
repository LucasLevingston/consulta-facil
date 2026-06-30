import type { ClinicWorkingHoursResponse } from "@/features/schedule";

export interface ClinicHoursEditorProps {
	clinicId: string;
	savedHours: ClinicWorkingHoursResponse[];
}
