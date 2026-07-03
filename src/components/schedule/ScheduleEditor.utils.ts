import type {
	DayOfWeek,
	ProfessionalScheduleItem,
	ProfessionalScheduleResponse,
} from "@/features/schedule";
import { DEFAULT_BREAK } from "@/utils/constants/default-break";
import { DEFAULT_DURATION } from "@/utils/constants/default-duration";

export function buildDefaultRow(
	day: DayOfWeek,
	saved?: ProfessionalScheduleResponse,
): ProfessionalScheduleItem {
	if (saved) {
		return {
			dayOfWeek: day,
			startTime: saved.startTime,
			endTime: saved.endTime,
			consultationDurationMinutes: saved.consultationDurationMinutes,
			breakBetweenConsultationsMinutes: saved.breakBetweenConsultationsMinutes,
			isActive: saved.isActive,
		};
	}
	const isWeekend = day === "SATURDAY" || day === "SUNDAY";
	return {
		dayOfWeek: day,
		startTime: "08:00",
		endTime: "18:00",
		consultationDurationMinutes: DEFAULT_DURATION,
		breakBetweenConsultationsMinutes: DEFAULT_BREAK,
		isActive: !isWeekend,
	};
}
