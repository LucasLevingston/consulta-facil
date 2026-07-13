import { describe, expect, it } from "vitest";
import { computeSlots } from "./compute-slots";

const baseSchedule = {
	startTime: "08:00",
	endTime: "10:00",
	consultationDurationMinutes: 30,
	breakBetweenConsultationsMinutes: 0,
};

describe("computeSlots", () => {
	it("generates correct number of slots with no break", () => {
		// 08:00–10:00, 30min each, no break → 4 slots
		const slots = computeSlots(baseSchedule);
		expect(slots).toHaveLength(4);
	});

	it("first slot is startTime", () => {
		const slots = computeSlots(baseSchedule);
		expect(slots[0].label).toBe("08:00");
	});

	it("slots are spaced by duration + break", () => {
		const slots = computeSlots({
			...baseSchedule,
			breakBetweenConsultationsMinutes: 10,
		});
		// step = 40min: 08:00, 08:40, 09:20
		expect(slots[0].label).toBe("08:00");
		expect(slots[1].label).toBe("08:40");
		expect(slots[2].label).toBe("09:20");
	});

	it("serviceDuration overrides schedule duration", () => {
		// 08:00–10:00 with 60min → 2 slots
		const slots = computeSlots(baseSchedule, 60);
		expect(slots).toHaveLength(2);
		expect(slots[0].label).toBe("08:00");
		expect(slots[1].label).toBe("09:00");
	});

	it("last slot does not exceed endTime", () => {
		const slots = computeSlots(baseSchedule);
		const last = slots[slots.length - 1];
		// last slot 09:30, duration 30 → ends at 10:00, OK
		expect(last.label).toBe("09:30");
	});

	it("slot has hours and minutes fields", () => {
		const slots = computeSlots(baseSchedule);
		expect(slots[0].hours).toBe(8);
		expect(slots[0].minutes).toBe(0);
	});

	it("no slots when duration exceeds window", () => {
		const slots = computeSlots(
			{ ...baseSchedule, startTime: "09:00", endTime: "09:30" },
			60,
		);
		expect(slots).toHaveLength(0);
	});

	it("generates 4 slots for 4-hour schedule with 60-min sessions", () => {
		const schedule = {
			startTime: "08:00",
			endTime: "12:00",
			consultationDurationMinutes: 60,
			breakBetweenConsultationsMinutes: 0,
		};
		expect(computeSlots(schedule)).toHaveLength(4);
	});

	it("includes break time between slots (15-min break)", () => {
		const schedule = {
			startTime: "08:00",
			endTime: "12:00",
			consultationDurationMinutes: 60,
			breakBetweenConsultationsMinutes: 15,
		};
		expect(computeSlots(schedule)[1].label).toBe("09:15");
	});

	it("respects serviceDuration override (4-hour schedule)", () => {
		const schedule = {
			startTime: "08:00",
			endTime: "12:00",
			consultationDurationMinutes: 60,
			breakBetweenConsultationsMinutes: 0,
		};
		expect(computeSlots(schedule, 30)).toHaveLength(8);
	});
});
