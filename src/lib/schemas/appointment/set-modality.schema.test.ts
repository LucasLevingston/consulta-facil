import { describe, expect, it } from "vitest";
import { setModalitySchema } from "./set-modality.schema";

describe("setModalitySchema", () => {
	it("aceita modality IN_PERSON e ONLINE", () => {
		expect(setModalitySchema.safeParse({ modality: "IN_PERSON" }).success).toBe(
			true,
		);
		expect(setModalitySchema.safeParse({ modality: "ONLINE" }).success).toBe(
			true,
		);
	});

	it("rejeita modality inválida", () => {
		expect(
			setModalitySchema.safeParse({ modality: "PRESENCIAL" }).success,
		).toBe(false);
	});

	it("aceita meetLink opcional ausente", () => {
		const result = setModalitySchema.safeParse({ modality: "ONLINE" });
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.meetLink).toBeUndefined();
	});

	it("rejeita sem modality (obrigatório)", () => {
		expect(setModalitySchema.safeParse({}).success).toBe(false);
	});
});
