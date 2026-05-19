import { describe, expect, it } from "vitest";

import {
	appointmentFormSchema,
	cancelAppointmentSchema,
	createAppointmentSchema,
} from "@/lib/schemas/appointment.schema";

describe("createAppointmentSchema", () => {
	const valid = {
		doctorId: "doctor-uuid-123",
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

	it("rejeita doctorId vazio", () => {
		const result = createAppointmentSchema.safeParse({ ...valid, doctorId: "" });
		expect(result.success).toBe(false);
		expect(result.error?.flatten().fieldErrors.doctorId).toBeDefined();
	});

	it("rejeita scheduledAt vazio", () => {
		const result = createAppointmentSchema.safeParse({ ...valid, scheduledAt: "" });
		expect(result.success).toBe(false);
		expect(result.error?.flatten().fieldErrors.scheduledAt).toBeDefined();
	});

	it("rejeita objeto sem campos obrigatórios", () => {
		expect(createAppointmentSchema.safeParse({}).success).toBe(false);
	});
});

describe("cancelAppointmentSchema", () => {
	it("aceita motivo válido", () => {
		const result = cancelAppointmentSchema.safeParse({
			cancellationReason: "Compromisso inadiável",
		});
		expect(result.success).toBe(true);
	});

	it("rejeita motivo vazio", () => {
		const result = cancelAppointmentSchema.safeParse({ cancellationReason: "" });
		expect(result.success).toBe(false);
		expect(result.error?.flatten().fieldErrors.cancellationReason).toBeDefined();
	});

	it("rejeita objeto sem o campo obrigatório", () => {
		expect(cancelAppointmentSchema.safeParse({}).success).toBe(false);
	});
});

describe("appointmentFormSchema", () => {
	const valid = {
		doctorId: "doctor-uuid-456",
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

	it("rejeita doctorId vazio", () => {
		const result = appointmentFormSchema.safeParse({ ...valid, doctorId: "" });
		expect(result.success).toBe(false);
		expect(result.error?.flatten().fieldErrors.doctorId).toBeDefined();
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
