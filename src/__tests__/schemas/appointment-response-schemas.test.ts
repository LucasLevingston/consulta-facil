import { describe, expect, it } from "vitest";

import { appointmentPaymentStatusSchema } from "@/lib/schemas/appointment/appointment-payment-status.schema";
import { appointmentResponseSchema } from "@/lib/schemas/appointment/appointment-response.schema";
import { appointmentStatusSchema } from "@/lib/schemas/appointment/appointment-status.schema";
import { paymentResponseSchema } from "@/lib/schemas/appointment/payment-response.schema";
import { qrCheckInTokenSchema } from "@/lib/schemas/appointment/qr-checkin-token.schema";
import { rateAppointmentSchema } from "@/lib/schemas/appointment/rate-appointment.schema";
import { rescheduleAppointmentSchema } from "@/lib/schemas/appointment/reschedule-appointment.schema";
import { setModalitySchema } from "@/lib/schemas/appointment/set-modality.schema";

describe("appointmentStatusSchema", () => {
	it("aceita valor válido", () => {
		expect(appointmentStatusSchema.safeParse("CONFIRMED").success).toBe(true);
	});

	it("rejeita valor inválido", () => {
		expect(appointmentStatusSchema.safeParse("UNKNOWN").success).toBe(false);
	});
});

describe("appointmentPaymentStatusSchema", () => {
	it("aceita valor válido", () => {
		expect(appointmentPaymentStatusSchema.safeParse("PAID").success).toBe(true);
	});

	it("rejeita valor inválido", () => {
		expect(appointmentPaymentStatusSchema.safeParse("INVALID").success).toBe(
			false,
		);
	});
});

describe("appointmentResponseSchema", () => {
	const valid = {
		id: "appt-1",
		patientId: "patient-1",
		professionalId: "professional-1",
		scheduledAt: "2026-07-10T10:00:00",
		status: "PENDING",
	};

	it("aceita objeto válido mínimo", () => {
		const result = appointmentResponseSchema.safeParse(valid);
		expect(result.success).toBe(true);
	});

	it("aceita campos opcionais/nullable ausentes", () => {
		const result = appointmentResponseSchema.safeParse(valid);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.reason).toBeUndefined();
			expect(result.data.rating).toBeUndefined();
		}
	});

	it("rejeita sem status (obrigatório)", () => {
		const { status, ...withoutStatus } = valid;
		const result = appointmentResponseSchema.safeParse(withoutStatus);
		expect(result.success).toBe(false);
	});

	it("rejeita tipo inválido em scheduledAt", () => {
		const result = appointmentResponseSchema.safeParse({
			...valid,
			scheduledAt: 12345,
		});
		expect(result.success).toBe(false);
	});

	it("aceita rating entre 1 e 5", () => {
		expect(
			appointmentResponseSchema.safeParse({ ...valid, rating: 1 }).success,
		).toBe(true);
		expect(
			appointmentResponseSchema.safeParse({ ...valid, rating: 5 }).success,
		).toBe(true);
	});

	it("rejeita rating fora do intervalo 1-5", () => {
		expect(
			appointmentResponseSchema.safeParse({ ...valid, rating: 0 }).success,
		).toBe(false);
		expect(
			appointmentResponseSchema.safeParse({ ...valid, rating: 6 }).success,
		).toBe(false);
	});
});

describe("paymentResponseSchema", () => {
	const valid = {
		checkoutUrl: "https://checkout.mercadopago.com/abc",
		preferenceId: "pref-1",
		appointmentId: "appt-1",
	};

	it("aceita objeto válido mínimo", () => {
		expect(paymentResponseSchema.safeParse(valid).success).toBe(true);
	});

	it("rejeita sem checkoutUrl (obrigatório)", () => {
		const { checkoutUrl, ...withoutUrl } = valid;
		expect(paymentResponseSchema.safeParse(withoutUrl).success).toBe(false);
	});

	it("rejeita tipo inválido em preferenceId", () => {
		expect(
			paymentResponseSchema.safeParse({ ...valid, preferenceId: 123 }).success,
		).toBe(false);
	});
});

describe("qrCheckInTokenSchema", () => {
	const valid = { appointmentId: "appt-1", token: "tok-123" };

	it("aceita objeto válido mínimo", () => {
		expect(qrCheckInTokenSchema.safeParse(valid).success).toBe(true);
	});

	it("rejeita sem token (obrigatório)", () => {
		const { token, ...withoutToken } = valid;
		expect(qrCheckInTokenSchema.safeParse(withoutToken).success).toBe(false);
	});

	it("rejeita tipo inválido em appointmentId", () => {
		expect(
			qrCheckInTokenSchema.safeParse({ ...valid, appointmentId: 1 }).success,
		).toBe(false);
	});
});

describe("rateAppointmentSchema", () => {
	it("aceita stars entre 1 e 5", () => {
		expect(rateAppointmentSchema.safeParse({ stars: 1 }).success).toBe(true);
		expect(rateAppointmentSchema.safeParse({ stars: 5 }).success).toBe(true);
	});

	it("rejeita stars fora do intervalo 1-5", () => {
		expect(rateAppointmentSchema.safeParse({ stars: 0 }).success).toBe(false);
		expect(rateAppointmentSchema.safeParse({ stars: 6 }).success).toBe(false);
	});

	it("aceita comment opcional ausente", () => {
		const result = rateAppointmentSchema.safeParse({ stars: 3 });
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.comment).toBeUndefined();
	});

	it("rejeita comment com mais de 500 caracteres", () => {
		const result = rateAppointmentSchema.safeParse({
			stars: 3,
			comment: "a".repeat(501),
		});
		expect(result.success).toBe(false);
	});

	it("rejeita stars não inteiro", () => {
		expect(rateAppointmentSchema.safeParse({ stars: 3.5 }).success).toBe(false);
	});
});

describe("rescheduleAppointmentSchema", () => {
	it("aceita scheduledAt como Date", () => {
		const result = rescheduleAppointmentSchema.safeParse({
			scheduledAt: new Date("2026-07-10T10:00:00"),
		});
		expect(result.success).toBe(true);
	});

	it("rejeita scheduledAt como string", () => {
		const result = rescheduleAppointmentSchema.safeParse({
			scheduledAt: "2026-07-10T10:00:00",
		});
		expect(result.success).toBe(false);
	});

	it("rejeita reason com mais de 500 caracteres", () => {
		const result = rescheduleAppointmentSchema.safeParse({
			scheduledAt: new Date(),
			reason: "a".repeat(501),
		});
		expect(result.success).toBe(false);
	});
});

describe("setModalitySchema", () => {
	it("aceita modality IN_PERSON e ONLINE", () => {
		expect(setModalitySchema.safeParse({ modality: "IN_PERSON" }).success).toBe(
			true,
		);
		expect(setModalitySchema.safeParse({ modality: "ONLINE" }).success).toBe(
			true,
		);
	});

	it("rejeita modality inválida", () => {
		expect(
			setModalitySchema.safeParse({ modality: "PRESENCIAL" }).success,
		).toBe(false);
	});

	it("aceita meetLink opcional ausente", () => {
		const result = setModalitySchema.safeParse({ modality: "ONLINE" });
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.meetLink).toBeUndefined();
	});

	it("rejeita sem modality (obrigatório)", () => {
		expect(setModalitySchema.safeParse({}).success).toBe(false);
	});
});
