import type { ProfessionalScheduleResponse } from "@/lib/schemas/schedule/professional-schedule-response.schema";
import type { TimeSlot } from "@/lib/types/time-slot";

export function computeSlots(
	schedule: ProfessionalScheduleResponse,
	serviceDuration?: number,
): TimeSlot[] {
	const [startH, startM] = schedule.startTime.split(":").map(Number);
	const [endH, endM] = schedule.endTime.split(":").map(Number);
	const startMin = startH * 60 + startM;
	const endMin = endH * 60 + endM;
	const duration = serviceDuration ?? schedule.consultationDurationMinutes;
	const step = duration + schedule.breakBetweenConsultationsMinutes;
	const slots: TimeSlot[] = [];
	let current = startMin;
	while (current + duration <= endMin) {
		const h = Math.floor(current / 60);
		const m = current % 60;
		slots.push({
			label: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
			hours: h,
			minutes: m,
		});
		current += step;
	}
	return slots;
}
