import { describe, expect, it } from "vitest";
import { computeSlots } from "@/lib/utils/compute-slots";

const BASE_SCHEDULE = {
	startTime: "08:00",
	endTime: "12:00",
	consultationDurationMinutes: 60,
	breakBetweenConsultationsMinutes: 0,
};

describe("computeSlots", () => {
	it("generates 4 slots for 4-hour schedule with 60-min sessions", () => {
		expect(computeSlots(BASE_SCHEDULE)).toHaveLength(4);
	});
	it("first slot starts at 08:00", () => {
		expect(computeSlots(BASE_SCHEDULE)[0].label).toBe("08:00");
	});
	it("includes break time between slots", () => {
		const s = { ...BASE_SCHEDULE, breakBetweenConsultationsMinutes: 15 };
		expect(computeSlots(s)[1].label).toBe("09:15");
	});
	it("respects serviceDuration override", () => {
		expect(computeSlots(BASE_SCHEDULE, 30)).toHaveLength(8);
	});
});
