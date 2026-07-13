import { describe, expect, it } from "vitest";
import { qrCheckInTokenSchema } from "./qr-checkin-token.schema";

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
