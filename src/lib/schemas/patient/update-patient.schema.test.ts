import { describe, expect, it } from "vitest";
import { updatePatientSchema } from "./update-patient.schema";

describe("updatePatientSchema", () => {
	it("aceita objeto vazio (occupation opcional)", () => {
		expect(updatePatientSchema.safeParse({}).success).toBe(true);
	});

	it("aceita occupation válida", () => {
		const result = updatePatientSchema.safeParse({ occupation: "Engenheiro" });
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.occupation).toBe("Engenheiro");
	});
});
