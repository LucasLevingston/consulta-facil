import { describe, expect, it } from "vitest";
import { createAppointmentSchema } from "./create-appointment.schema";

describe("createAppointmentSchema", () => {
	const valid = {
		professionalId: "doctor-uuid-123",
		scheduledAt: "2026-06-01T10:00:00",
	};

	it("aceita dados válidos", () => {
		expect(createAppointmentSchema.safeParse(valid).success).toBe(true);
	});

	it("aceita dados com campos opcionais", () => {
		const result = createAppointmentSchema.safeParse({
			...valid,
			reason: "Consulta de rotina",
			notes: "Trazer exames anteriores",
		});
		expect(result.success).toBe(true);
	});

	it("rejeita professionalId vazio", () => {
		const result = createAppointmentSchema.safeParse({
			...valid,
			professionalId: "",
		});
		expect(result.success).toBe(false);
		expect(result.error?.flatten().fieldErrors.professionalId).toBeDefined();
	});

	it("rejeita scheduledAt vazio", () => {
		const result = createAppointmentSchema.safeParse({
			...valid,
			scheduledAt: "",
		});
		expect(result.success).toBe(false);
		expect(result.error?.flatten().fieldErrors.scheduledAt).toBeDefined();
	});

	it("rejeita objeto sem campos obrigatórios", () => {
		expect(createAppointmentSchema.safeParse({}).success).toBe(false);
	});
});
