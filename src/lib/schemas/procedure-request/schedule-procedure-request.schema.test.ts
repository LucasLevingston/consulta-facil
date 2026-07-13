import { describe, expect, it } from "vitest";
import { scheduleProcedureRequestSchema } from "./schedule-procedure-request.schema";

describe("scheduleProcedureRequestSchema", () => {
	it("aceita scheduledAt válido", () => {
		const result = scheduleProcedureRequestSchema.safeParse({
			scheduledAt: "2026-07-01T10:00:00",
		});
		expect(result.success).toBe(true);
	});

	it("rejeita scheduledAt vazio", () => {
		const result = scheduleProcedureRequestSchema.safeParse({
			scheduledAt: "",
		});
		expect(result.success).toBe(false);
	});

	it("aceita modality opcional IN_PERSON e ONLINE", () => {
		expect(
			scheduleProcedureRequestSchema.safeParse({
				scheduledAt: "2026-07-01T10:00:00",
				modality: "IN_PERSON",
			}).success,
		).toBe(true);
		expect(
			scheduleProcedureRequestSchema.safeParse({
				scheduledAt: "2026-07-01T10:00:00",
				modality: "ONLINE",
			}).success,
		).toBe(true);
	});

	it("rejeita modality inválida", () => {
		const result = scheduleProcedureRequestSchema.safeParse({
			scheduledAt: "2026-07-01T10:00:00",
			modality: "PRESENCIAL",
		});
		expect(result.success).toBe(false);
	});
});
