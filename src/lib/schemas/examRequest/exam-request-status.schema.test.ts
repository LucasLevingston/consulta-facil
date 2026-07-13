import { describe, expect, it } from "vitest";
import { examRequestStatusSchema } from "./exam-request-status.schema";

describe("examRequestStatusSchema", () => {
	it("aceita valor válido", () => {
		expect(examRequestStatusSchema.safeParse("SCHEDULED").success).toBe(true);
	});

	it("rejeita valor inválido", () => {
		expect(examRequestStatusSchema.safeParse("INVALID").success).toBe(false);
	});
});
