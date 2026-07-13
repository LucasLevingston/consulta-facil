import { describe, expect, it } from "vitest";
import { appointmentFormSchema } from "./appointment-form.schema";

describe("appointmentFormSchema", () => {
	const valid = {
		professionalId: "doctor-uuid-456",
		scheduledAt: new Date("2026-06-01T10:00:00"),
	};

	it("aceita dados mínimos válidos", () => {
		expect(appointmentFormSchema.safeParse(valid).success).toBe(true);
	});

	it("aceita todos os campos opcionais", () => {
		const result = appointmentFormSchema.safeParse({
			...valid,
			userId: "user-uuid",
			reason: "Dor de cabeça",
			notes: "Informação extra",
			cancellationReason: "Motivo",
		});
		expect(result.success).toBe(true);
	});

	it("rejeita professionalId vazio", () => {
		const result = appointmentFormSchema.safeParse({
			...valid,
			professionalId: "",
		});
		expect(result.success).toBe(false);
		expect(result.error?.flatten().fieldErrors.professionalId).toBeDefined();
	});

	it("rejeita scheduledAt que não é Date", () => {
		const result = appointmentFormSchema.safeParse({
			...valid,
			scheduledAt: "2026-06-01T10:00:00",
		});
		expect(result.success).toBe(false);
		expect(result.error?.flatten().fieldErrors.scheduledAt).toBeDefined();
	});

	it("rejeita reason com mais de 500 caracteres", () => {
		const result = appointmentFormSchema.safeParse({
			...valid,
			reason: "a".repeat(501),
		});
		expect(result.success).toBe(false);
		expect(result.error?.flatten().fieldErrors.reason).toBeDefined();
	});
});
