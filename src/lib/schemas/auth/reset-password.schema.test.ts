import { describe, expect, it } from "vitest";
import { resetPasswordSchema } from "./reset-password.schema";

describe("resetPasswordSchema", () => {
	it("aceita senhas iguais e válidas", () => {
		const result = resetPasswordSchema.safeParse({
			newPassword: "senha1234",
			confirmPassword: "senha1234",
		});
		expect(result.success).toBe(true);
	});

	it("rejeita senhas diferentes", () => {
		const result = resetPasswordSchema.safeParse({
			newPassword: "senha1234",
			confirmPassword: "outrasenha",
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.flatten().fieldErrors.confirmPassword).toBeDefined();
		}
	});

	it("rejeita senha com menos de 8 caracteres", () => {
		const result = resetPasswordSchema.safeParse({
			newPassword: "1234567",
			confirmPassword: "1234567",
		});
		expect(result.success).toBe(false);
	});

	it("rejeita objeto sem campos obrigatórios", () => {
		expect(resetPasswordSchema.safeParse({}).success).toBe(false);
	});
});
