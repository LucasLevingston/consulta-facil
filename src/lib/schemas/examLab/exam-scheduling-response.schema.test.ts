import { describe, expect, it } from "vitest";
import { examSchedulingResponseSchema } from "./exam-scheduling-response.schema";

describe("examSchedulingResponseSchema", () => {
	const valid = {
		id: "sched-1",
		examRequestId: "req-1",
		examLabId: "lab-1",
		scheduledDate: "2026-07-10",
		scheduledTime: "10:00",
		status: "SCHEDULED",
	};

	it("aceita objeto válido mínimo", () => {
		expect(examSchedulingResponseSchema.safeParse(valid).success).toBe(true);
	});

	it("aceita todos os status válidos", () => {
		const statuses = ["SCHEDULED", "COMPLETED", "CANCELLED"];
		for (const status of statuses) {
			expect(
				examSchedulingResponseSchema.safeParse({ ...valid, status }).success,
			).toBe(true);
		}
	});

	it("rejeita status inválido", () => {
		expect(
			examSchedulingResponseSchema.safeParse({ ...valid, status: "PENDING" })
				.success,
		).toBe(false);
	});

	it("rejeita sem examLabId (obrigatório)", () => {
		const { examLabId, ...withoutExamLabId } = valid;
		expect(
			examSchedulingResponseSchema.safeParse(withoutExamLabId).success,
		).toBe(false);
	});
});
