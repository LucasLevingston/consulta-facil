import { describe, expect, it } from "vitest";
import { cancelAppointmentSchema } from "./cancel-appointment.schema";

describe("cancelAppointmentSchema", () => {
	it("aceita motivo válido", () => {
		const result = cancelAppointmentSchema.safeParse({
			cancellationReason: "Compromisso inadiável",
		});
		expect(result.success).toBe(true);
	});

	it("rejeita motivo vazio", () => {
		const result = cancelAppointmentSchema.safeParse({
			cancellationReason: "",
		});
		expect(result.success).toBe(false);
		expect(
			result.error?.flatten().fieldErrors.cancellationReason,
		).toBeDefined();
	});

	it("rejeita objeto sem o campo obrigatório", () => {
		expect(cancelAppointmentSchema.safeParse({}).success).toBe(false);
	});
});
