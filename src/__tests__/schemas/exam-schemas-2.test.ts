import { describe, expect, it } from "vitest";

import { availableSlotSchema } from "@/lib/schemas/examLab/available-slot.schema";
import {
	examLabHoursEntrySchema,
	examLabResponseSchema,
} from "@/lib/schemas/examLab/exam-lab-response.schema";
import { examSchedulingResponseSchema } from "@/lib/schemas/examLab/exam-scheduling-response.schema";
import { examRequestResponseSchema } from "@/lib/schemas/examRequest/exam-request-response.schema";
import { examRequestStatusSchema } from "@/lib/schemas/examRequest/exam-request-status.schema";

describe("availableSlotSchema", () => {
	it("aceita objeto válido", () => {
		const result = availableSlotSchema.safeParse({
			time: "10:00",
			available: true,
		});
		expect(result.success).toBe(true);
	});

	it("rejeita sem available (obrigatório)", () => {
		expect(availableSlotSchema.safeParse({ time: "10:00" }).success).toBe(
			false,
		);
	});

	it("rejeita tipo inválido em available", () => {
		expect(
			availableSlotSchema.safeParse({ time: "10:00", available: "true" })
				.success,
		).toBe(false);
	});
});

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

describe("examSchedulingResponseSchema", () => {
	const valid = {
		id: "sched-1",
		examRequestId: "req-1",
		examLabId: "lab-1",
		scheduledDate: "2026-07-10",
		scheduledTime: "10:00",
		status: "SCHEDULED",
	};

	it("aceita objeto válido mínimo", () => {
		expect(examSchedulingResponseSchema.safeParse(valid).success).toBe(true);
	});

	it("aceita todos os status válidos", () => {
		const statuses = ["SCHEDULED", "COMPLETED", "CANCELLED"];
		for (const status of statuses) {
			expect(
				examSchedulingResponseSchema.safeParse({ ...valid, status }).success,
			).toBe(true);
		}
	});

	it("rejeita status inválido", () => {
		expect(
			examSchedulingResponseSchema.safeParse({ ...valid, status: "PENDING" })
				.success,
		).toBe(false);
	});

	it("rejeita sem examLabId (obrigatório)", () => {
		const { examLabId, ...withoutExamLabId } = valid;
		expect(
			examSchedulingResponseSchema.safeParse(withoutExamLabId).success,
		).toBe(false);
	});
});

describe("examRequestStatusSchema", () => {
	it("aceita valor válido", () => {
		expect(examRequestStatusSchema.safeParse("SCHEDULED").success).toBe(true);
	});

	it("rejeita valor inválido", () => {
		expect(examRequestStatusSchema.safeParse("INVALID").success).toBe(false);
	});
});

describe("examRequestResponseSchema", () => {
	const valid = {
		id: "req-1",
		appointmentId: "appt-1",
		professionalId: "prof-1",
		patientId: "patient-1",
		examName: "HEMOGRAMA_COMPLETO",
		status: "PENDING",
	};

	it("aceita objeto válido mínimo", () => {
		expect(examRequestResponseSchema.safeParse(valid).success).toBe(true);
	});

	it("aceita campos opcionais/nullable ausentes", () => {
		const result = examRequestResponseSchema.safeParse(valid);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.fileUrl).toBeUndefined();
			expect(result.data.scheduledAt).toBeUndefined();
		}
	});

	it("rejeita status inválido", () => {
		expect(
			examRequestResponseSchema.safeParse({ ...valid, status: "INVALID" })
				.success,
		).toBe(false);
	});

	it("rejeita sem examName (obrigatório)", () => {
		const { examName, ...withoutExamName } = valid;
		expect(examRequestResponseSchema.safeParse(withoutExamName).success).toBe(
			false,
		);
	});
});
