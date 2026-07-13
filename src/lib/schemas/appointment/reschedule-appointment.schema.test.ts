import { describe, expect, it } from "vitest";
import { rescheduleAppointmentSchema } from "./reschedule-appointment.schema";

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
