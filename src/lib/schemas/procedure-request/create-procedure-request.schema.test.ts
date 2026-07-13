import { describe, expect, it } from "vitest";
import { createProcedureRequestSchema } from "./create-procedure-request.schema";

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
