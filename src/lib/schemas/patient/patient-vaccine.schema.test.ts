import { describe, expect, it } from "vitest";
import { patientVaccineSchema } from "./patient-vaccine.schema";

describe("patientVaccineSchema", () => {
	it("aceita objeto válido mínimo", () => {
		expect(
			patientVaccineSchema.safeParse({ vaccineName: "Gripe" }).success,
		).toBe(true);
	});

	it("aceita campos opcionais ausentes", () => {
		const result = patientVaccineSchema.safeParse({ vaccineName: "Gripe" });
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.doseNumber).toBeUndefined();
			expect(result.data.notes).toBeUndefined();
		}
	});

	it("rejeita vaccineName com menos de 2 caracteres", () => {
		expect(patientVaccineSchema.safeParse({ vaccineName: "G" }).success).toBe(
			false,
		);
	});

	it("rejeita notes com mais de 500 caracteres", () => {
		expect(
			patientVaccineSchema.safeParse({
				vaccineName: "Gripe",
				notes: "a".repeat(501),
			}).success,
		).toBe(false);
	});
});
