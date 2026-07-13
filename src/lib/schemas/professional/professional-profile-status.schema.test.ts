import { describe, expect, it } from "vitest";
import { professionalProfileStatusSchema } from "./professional-profile-status.schema";

describe("professionalProfileStatusSchema", () => {
	it("aceita valor válido", () => {
		expect(professionalProfileStatusSchema.safeParse("ACTIVE").success).toBe(
			true,
		);
	});

	it("rejeita valor inválido", () => {
		expect(professionalProfileStatusSchema.safeParse("INVALID").success).toBe(
			false,
		);
	});
});
