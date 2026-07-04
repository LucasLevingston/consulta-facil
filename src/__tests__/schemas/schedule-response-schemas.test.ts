import { describe, expect, it } from "vitest";

import { clinicWorkingHoursResponseSchema } from "@/lib/schemas/schedule/clinic-working-hours-response.schema";
import { professionalScheduleResponseSchema } from "@/lib/schemas/schedule/professional-schedule-response.schema";

describe("clinicWorkingHoursResponseSchema", () => {
	const valid = {
		id: "hours-1",
		clinicId: "clinic-1",
		dayOfWeek: "MONDAY",
		openTime: "08:00",
		closeTime: "18:00",
		isOpen: true,
	};

	it("aceita objeto válido", () => {
		expect(clinicWorkingHoursResponseSchema.safeParse(valid).success).toBe(
			true,
		);
	});

	it("rejeita sem id (obrigatório, herdado por extend)", () => {
		const { id, ...withoutId } = valid;
		expect(clinicWorkingHoursResponseSchema.safeParse(withoutId).success).toBe(
			false,
		);
	});

	it("rejeita dayOfWeek inválido", () => {
		expect(
			clinicWorkingHoursResponseSchema.safeParse({
				...valid,
				dayOfWeek: "INVALID",
			}).success,
		).toBe(false);
	});

	it("rejeita formato de horário inválido", () => {
		expect(
			clinicWorkingHoursResponseSchema.safeParse({
				...valid,
				openTime: "8:00",
			}).success,
		).toBe(false);
	});
});

describe("professionalScheduleResponseSchema", () => {
	const valid = {
		id: "sched-1",
		professionalProfileId: "prof-1",
		dayOfWeek: "TUESDAY",
		startTime: "08:00",
		endTime: "17:00",
		consultationDurationMinutes: 30,
		breakBetweenConsultationsMinutes: 10,
		isActive: true,
	};

	it("aceita objeto válido", () => {
		expect(professionalScheduleResponseSchema.safeParse(valid).success).toBe(
			true,
		);
	});

	it("rejeita sem professionalProfileId (obrigatório, herdado por extend)", () => {
		const { professionalProfileId, ...withoutProfId } = valid;
		expect(
			professionalScheduleResponseSchema.safeParse(withoutProfId).success,
		).toBe(false);
	});

	it("rejeita consultationDurationMinutes fora do intervalo 5-480", () => {
		expect(
			professionalScheduleResponseSchema.safeParse({
				...valid,
				consultationDurationMinutes: 4,
			}).success,
		).toBe(false);
		expect(
			professionalScheduleResponseSchema.safeParse({
				...valid,
				consultationDurationMinutes: 481,
			}).success,
		).toBe(false);
	});

	it("rejeita breakBetweenConsultationsMinutes fora do intervalo 0-120", () => {
		expect(
			professionalScheduleResponseSchema.safeParse({
				...valid,
				breakBetweenConsultationsMinutes: -1,
			}).success,
		).toBe(false);
		expect(
			professionalScheduleResponseSchema.safeParse({
				...valid,
				breakBetweenConsultationsMinutes: 121,
			}).success,
		).toBe(false);
	});
});
