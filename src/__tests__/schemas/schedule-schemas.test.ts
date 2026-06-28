import { describe, expect, it } from "vitest";

import { clinicWorkingHoursItemSchema } from "@/lib/schemas/schedule/clinic-working-hours-item.schema";
import { professionalScheduleItemSchema } from "@/lib/schemas/schedule/professional-schedule-item.schema";

describe("professionalScheduleItemSchema — validação de horário", () => {
	const valid = {
		dayOfWeek: "MONDAY",
		startTime: "08:00",
		endTime: "17:00",
		consultationDurationMinutes: 30,
		breakBetweenConsultationsMinutes: 10,
		isActive: true,
	} as const;

	it("aceita horário válido", () => {
		expect(professionalScheduleItemSchema.safeParse(valid).success).toBe(true);
	});

	it("rejeita dayOfWeek inválido", () => {
		const result = professionalScheduleItemSchema.safeParse({
			...valid,
			dayOfWeek: "INVALID",
		});
		expect(result.success).toBe(false);
	});

	it("rejeita formato de horário sem dois dígitos na hora", () => {
		expect(
			professionalScheduleItemSchema.safeParse({ ...valid, startTime: "8:00" })
				.success,
		).toBe(false);
		expect(
			professionalScheduleItemSchema.safeParse({ ...valid, endTime: "9:30" })
				.success,
		).toBe(false);
		expect(
			professionalScheduleItemSchema.safeParse({ ...valid, startTime: "08:0" })
				.success,
		).toBe(false);
	});

	it("rejeita duration menor que 5 minutos", () => {
		const result = professionalScheduleItemSchema.safeParse({
			...valid,
			consultationDurationMinutes: 4,
		});
		expect(result.success).toBe(false);
	});

	it("rejeita duration maior que 480 minutos", () => {
		const result = professionalScheduleItemSchema.safeParse({
			...valid,
			consultationDurationMinutes: 481,
		});
		expect(result.success).toBe(false);
	});

	it("aceita todos os dias da semana", () => {
		const days = [
			"MONDAY",
			"TUESDAY",
			"WEDNESDAY",
			"THURSDAY",
			"FRIDAY",
			"SATURDAY",
			"SUNDAY",
		] as const;
		for (const day of days) {
			const result = professionalScheduleItemSchema.safeParse({
				...valid,
				dayOfWeek: day,
			});
			expect(result.success).toBe(true);
		}
	});
});

describe("clinicWorkingHoursItemSchema — validação de horário de clínica", () => {
	const valid = {
		dayOfWeek: "MONDAY",
		openTime: "08:00",
		closeTime: "18:00",
		isOpen: true,
	} as const;

	it("aceita horário válido", () => {
		expect(clinicWorkingHoursItemSchema.safeParse(valid).success).toBe(true);
	});

	it("rejeita formato de horário sem dois dígitos na hora", () => {
		expect(
			clinicWorkingHoursItemSchema.safeParse({ ...valid, openTime: "8:00" })
				.success,
		).toBe(false);
	});

	it("aceita isOpen false", () => {
		const result = clinicWorkingHoursItemSchema.safeParse({
			...valid,
			isOpen: false,
		});
		expect(result.success).toBe(true);
	});
});
