import { describe, expect, it } from "vitest";
import {
	examLabHoursEntrySchema,
	examLabResponseSchema,
} from "./exam-lab-response.schema";

describe("examLabHoursEntrySchema", () => {
	const valid = {
		id: "hours-1",
		dayOfWeek: "MONDAY",
		openTime: "08:00",
		closeTime: "18:00",
		slotDurationMinutes: 30,
		isOpen: true,
	};

	it("aceita objeto válido", () => {
		expect(examLabHoursEntrySchema.safeParse(valid).success).toBe(true);
	});

	it("rejeita sem isOpen (obrigatório)", () => {
		const { isOpen, ...withoutIsOpen } = valid;
		expect(examLabHoursEntrySchema.safeParse(withoutIsOpen).success).toBe(
			false,
		);
	});
});

describe("examLabResponseSchema", () => {
	const valid = {
		id: "lab-1",
		name: "Laboratório Central",
		status: "ACTIVE",
	};

	it("aceita objeto válido mínimo, com defaults para arrays", () => {
		const result = examLabResponseSchema.safeParse(valid);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.acceptedExams).toEqual([]);
			expect(result.data.hours).toEqual([]);
		}
	});

	it("aceita acceptedExams e hours preenchidos", () => {
		const result = examLabResponseSchema.safeParse({
			...valid,
			acceptedExams: ["HEMOGRAMA"],
			hours: [
				{
					id: "hours-1",
					dayOfWeek: "MONDAY",
					openTime: "08:00",
					closeTime: "18:00",
					slotDurationMinutes: 30,
					isOpen: true,
				},
			],
		});
		expect(result.success).toBe(true);
	});

	it("rejeita sem name (obrigatório)", () => {
		const { name, ...withoutName } = valid;
		expect(examLabResponseSchema.safeParse(withoutName).success).toBe(false);
	});
});
