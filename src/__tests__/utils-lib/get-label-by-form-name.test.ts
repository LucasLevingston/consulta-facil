import { describe, expect, it } from "vitest";
import { getLabelByFormName } from "@/lib/utils/get-label-by-form-name";

describe("getLabelByFormName", () => {
	it("email → E-mail", () =>
		expect(getLabelByFormName("email")).toBe("E-mail"));
	it("password → Senha", () =>
		expect(getLabelByFormName("password")).toBe("Senha"));
	it("name → Nome", () => expect(getLabelByFormName("name")).toBe("Nome"));
	it("phone → Telefone", () =>
		expect(getLabelByFormName("phone")).toBe("Telefone"));
	it("cpf → CPF", () => expect(getLabelByFormName("cpf")).toBe("CPF"));
	it("birthDate → label", () => {
		expect(getLabelByFormName("birthDate")).toBe("Data de Nascimento");
	});
	it("unknown field → returns field name as-is", () => {
		expect(getLabelByFormName("customField")).toBe("customField");
	});
});
