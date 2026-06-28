import { describe, expect, it } from "vitest";

import { createProcedureRequestSchema } from "@/lib/schemas/procedure-request/create-procedure-request.schema";
import { scheduleProcedureRequestSchema } from "@/lib/schemas/procedure-request/schedule-procedure-request.schema";

describe("createProcedureRequestSchema — campos obrigatórios", () => {
	it("aceita dados válidos", () => {
		const result = createProcedureRequestSchema.safeParse({
			serviceId: "svc-1",
			patientId: "pat-1",
		});
		expect(result.success).toBe(true);
	});

	it("rejeita serviceId vazio", () => {
		const result = createProcedureRequestSchema.safeParse({
			serviceId: "",
			patientId: "pat-1",
		});
		expect(result.success).toBe(false);
	});

	it("rejeita patientId vazio", () => {
		const result = createProcedureRequestSchema.safeParse({
			serviceId: "svc-1",
			patientId: "",
		});
		expect(result.success).toBe(false);
	});

	it("notes é opcional", () => {
		const result = createProcedureRequestSchema.safeParse({
			serviceId: "svc-1",
			patientId: "pat-1",
		});
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.notes).toBeUndefined();
	});
});

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
