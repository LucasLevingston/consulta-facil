import { describe, expect, it } from "vitest";
import { procedureRequestStatusSchema } from "./procedure-request-status.schema";

describe("procedureRequestStatusSchema", () => {
	it("aceita valor válido", () => {
		expect(procedureRequestStatusSchema.safeParse("SCHEDULED").success).toBe(
			true,
		);
	});

	it("rejeita valor inválido", () => {
		expect(procedureRequestStatusSchema.safeParse("INVALID").success).toBe(
			false,
		);
	});
});
