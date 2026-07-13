import { describe, expect, it } from "vitest";
import { clinicWorkingHoursResponseSchema } from "./clinic-working-hours-response.schema";

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
