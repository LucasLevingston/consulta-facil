import { describe, expect, it } from "vitest";

import { ProfessionalDefaultValues } from "@/components/forms/ProfessionalDetails/DefaultValues";
import { ProfessionalFormValidation } from "@/components/forms/ProfessionalDetails/FormValidation";

describe("ProfessionalDefaultValues", () => {
	it("retorna os valores padrão esperados para o formulário de profissional", () => {
		expect(ProfessionalDefaultValues.name).toBe("");
		expect(ProfessionalDefaultValues.email).toBe("");
		expect(ProfessionalDefaultValues.phone).toBe("");
		expect(ProfessionalDefaultValues.gender).toBe("male");
		expect(ProfessionalDefaultValues.cpf).toBe("");
		expect(ProfessionalDefaultValues.address).toBe("");
		expect(ProfessionalDefaultValues.specialty).toBe("");
		expect(ProfessionalDefaultValues.licenseNumber).toBe("");
		expect(ProfessionalDefaultValues.identificationDocumentType).toBe("");
		expect(ProfessionalDefaultValues.identificationDocument).toBeUndefined();
		expect(ProfessionalDefaultValues.privacyConsent).toBe(false);
	});

	it("define birthDate como uma instância de Date", () => {
		expect(ProfessionalDefaultValues.birthDate).toBeInstanceOf(Date);
	});
});

function validData() {
	return {
		name: "Dra. Ana Silva",
		email: "ana@teste.com",
		phone: "11999999999",
		gender: "FEMALE" as const,
		birthDate: new Date("1990-01-01"),
		cpf: "111.444.777-35",
		address: "Rua das Flores, 123",
		profession: "MEDICO",
		specialty: "CARDIOLOGIA",
		licenseNumber: "12345",
		identificationDocumentType: "RG",
		privacyConsent: true,
	};
}

describe("ProfessionalFormValidation", () => {
	it("valida com sucesso quando todos os campos obrigatórios são válidos", () => {
		const result = ProfessionalFormValidation.safeParse(validData());
		expect(result.success).toBe(true);
	});

	it("rejeita quando o nome está vazio", () => {
		const result = ProfessionalFormValidation.safeParse({
			...validData(),
			name: "",
		});
		expect(result.success).toBe(false);
	});

	it("rejeita quando o e-mail é inválido", () => {
		const result = ProfessionalFormValidation.safeParse({
			...validData(),
			email: "email-invalido",
		});
		expect(result.success).toBe(false);
	});

	it("rejeita quando o telefone tem menos de 10 caracteres", () => {
		const result = ProfessionalFormValidation.safeParse({
			...validData(),
			phone: "123",
		});
		expect(result.success).toBe(false);
	});

	it("transforma o cpf removendo caracteres não numéricos antes de validar", () => {
		const result = ProfessionalFormValidation.safeParse({
			...validData(),
			cpf: "111.444.777-35",
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.cpf).toBe("11144477735");
		}
	});

	it("rejeita cpf que não tenha 11 dígitos após a remoção de caracteres não numéricos", () => {
		const result = ProfessionalFormValidation.safeParse({
			...validData(),
			cpf: "123",
		});
		expect(result.success).toBe(false);
	});

	it("rejeita quando o endereço tem menos de 5 caracteres", () => {
		const result = ProfessionalFormValidation.safeParse({
			...validData(),
			address: "Rua",
		});
		expect(result.success).toBe(false);
	});

	it("rejeita quando a profissão está vazia", () => {
		const result = ProfessionalFormValidation.safeParse({
			...validData(),
			profession: "",
		});
		expect(result.success).toBe(false);
	});

	it("rejeita quando a especialidade está vazia", () => {
		const result = ProfessionalFormValidation.safeParse({
			...validData(),
			specialty: "",
		});
		expect(result.success).toBe(false);
	});

	it("rejeita quando o número de licença está vazio", () => {
		const result = ProfessionalFormValidation.safeParse({
			...validData(),
			licenseNumber: "",
		});
		expect(result.success).toBe(false);
	});

	it("rejeita quando privacyConsent é false", () => {
		const result = ProfessionalFormValidation.safeParse({
			...validData(),
			privacyConsent: false,
		});
		expect(result.success).toBe(false);
	});

	it("aceita gender como MALE, FEMALE ou OTHER", () => {
		for (const gender of ["MALE", "FEMALE", "OTHER"] as const) {
			const result = ProfessionalFormValidation.safeParse({
				...validData(),
				gender,
			});
			expect(result.success).toBe(true);
		}
	});

	it("rejeita gender fora do enum permitido", () => {
		const result = ProfessionalFormValidation.safeParse({
			...validData(),
			gender: "INVALIDO",
		});
		expect(result.success).toBe(false);
	});
});
