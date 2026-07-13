import { describe, expect, it } from "vitest";
import { availableSlotSchema } from "./available-slot.schema";

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
