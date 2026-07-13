import { describe, expect, it } from "vitest";
import { clinicWorkingHoursItemSchema } from "./clinic-working-hours-item.schema";

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
