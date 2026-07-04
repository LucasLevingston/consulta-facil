import { describe, expect, it } from "vitest";
import { procedureRequestSchema } from "@/lib/schemas/procedure-request/procedure-request.schema";
import { procedureRequestStatusSchema } from "@/lib/schemas/procedure-request/procedure-request-status.schema";

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

describe("procedureRequestSchema", () => {
	const valid = {
		id: "proc-1",
		serviceId: "svc-1",
		serviceName: "Consulta",
		servicePrice: 150,
		serviceDurationMinutes: 30,
		patientId: "patient-1",
		professionalId: "professional-1",
		status: "PENDING",
	};

	it("aceita objeto válido mínimo", () => {
		expect(procedureRequestSchema.safeParse(valid).success).toBe(true);
	});

	it("aceita campos opcionais/nullable ausentes", () => {
		const result = procedureRequestSchema.safeParse(valid);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.appointmentId).toBeUndefined();
			expect(result.data.notes).toBeUndefined();
		}
	});

	it("rejeita sem status (obrigatório)", () => {
		const { status, ...withoutStatus } = valid;
		expect(procedureRequestSchema.safeParse(withoutStatus).success).toBe(false);
	});

	it("rejeita status inválido", () => {
		expect(
			procedureRequestSchema.safeParse({ ...valid, status: "UNKNOWN" }).success,
		).toBe(false);
	});

	it("rejeita serviceDurationMinutes não inteiro", () => {
		expect(
			procedureRequestSchema.safeParse({
				...valid,
				serviceDurationMinutes: 30.5,
			}).success,
		).toBe(false);
	});

	it("rejeita tipo inválido em servicePrice", () => {
		expect(
			procedureRequestSchema.safeParse({ ...valid, servicePrice: "150" })
				.success,
		).toBe(false);
	});
});
