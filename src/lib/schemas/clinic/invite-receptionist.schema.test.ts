import { describe, expect, it } from "vitest";
import { inviteReceptionistSchema } from "./invite-receptionist.schema";

describe("inviteReceptionistSchema — validação de e-mail", () => {
	it("aceita e-mail válido", () => {
		const result = inviteReceptionistSchema.safeParse({
			email: "rec@clinica.com",
		});
		expect(result.success).toBe(true);
	});

	it("rejeita e-mail inválido", () => {
		expect(
			inviteReceptionistSchema.safeParse({ email: "nao-e-email" }).success,
		).toBe(false);
		expect(
			inviteReceptionistSchema.safeParse({ email: "sem@ponto" }).success,
		).toBe(false);
	});

	it("rejeita e-mail vazio", () => {
		expect(inviteReceptionistSchema.safeParse({ email: "" }).success).toBe(
			false,
		);
	});
});
