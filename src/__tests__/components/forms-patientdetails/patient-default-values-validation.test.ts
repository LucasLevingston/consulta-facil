import { describe, expect, it } from "vitest";
import { PatientDefaultValues } from "@/components/forms/PatientDetails/DefaultValues";
import { PatientFormValidation } from "@/components/forms/PatientDetails/FormValidation";

describe("PatientDefaultValues", () => {
	it("possui os campos de texto vazios por padrão", () => {
		expect(PatientDefaultValues.name).toBe("");
		expect(PatientDefaultValues.email).toBe("");
		expect(PatientDefaultValues.phone).toBe("");
		expect(PatientDefaultValues.address).toBe("");
		expect(PatientDefaultValues.occupation).toBe("");
		expect(PatientDefaultValues.cpf).toBe("");
	});

	it("usa 'male' como gênero padrão", () => {
		expect(PatientDefaultValues.gender).toBe("male");
	});

	it("usa 'Birth Certificate' como tipo de documento padrão", () => {
		expect(PatientDefaultValues.identificationDocumentType).toBe(
			"Birth Certificate",
		);
	});

	it("define birthDate como uma instância de Date", () => {
		expect(PatientDefaultValues.birthDate).toBeInstanceOf(Date);
	});

	it("define os consentimentos como false por padrão", () => {
		expect(PatientDefaultValues.treatmentConsent).toBe(false);
		expect(PatientDefaultValues.disclosureConsent).toBe(false);
		expect(PatientDefaultValues.privacyConsent).toBe(false);
	});

	it("define os campos de arquivo como undefined por padrão", () => {
		expect(PatientDefaultValues.identificationDocument).toBeUndefined();
		expect(PatientDefaultValues.imageProfile).toBeUndefined();
	});
});

describe("PatientFormValidation", () => {
	const validData = {
		name: "João da Silva",
		email: "joao@teste.com",
		phone: "11999998888",
		birthDate: new Date("1990-01-01"),
		gender: "MALE",
		address: "Rua das Flores, 123",
		occupation: "Engenheiro",
		emergencyContactName: "Maria Silva",
		emergencyContactNumber: "11988887777",
		allergies: "",
		currentMedication: "",
		familyMedicalHistory: "",
		pastMedicalHistory: "",
		identificationDocumentType: "Passaporte",
		cpf: "12345678900",
		treatmentConsent: true,
		disclosureConsent: true,
		privacyConsent: true,
	};

	it("aceita um payload completo e válido", () => {
		const result = PatientFormValidation.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it("rejeita e-mail inválido com a mensagem esperada", () => {
		const result = PatientFormValidation.safeParse({
			...validData,
			email: "email-invalido",
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe(
				"Endereço de e-mail inválido",
			);
		}
	});

	it("rejeita nome com menos de 2 caracteres", () => {
		const result = PatientFormValidation.safeParse({
			...validData,
			name: "A",
		});
		expect(result.success).toBe(false);
	});

	it("rejeita gênero fora do enum permitido", () => {
		const result = PatientFormValidation.safeParse({
			...validData,
			gender: "UNKNOWN",
		});
		expect(result.success).toBe(false);
	});

	it("remove caracteres não numéricos do CPF antes de validar", () => {
		const result = PatientFormValidation.safeParse({
			...validData,
			cpf: "123.456.789-00",
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.cpf).toBe("12345678900");
		}
	});

	it("rejeita CPF que não tenha 11 dígitos após a limpeza", () => {
		const result = PatientFormValidation.safeParse({
			...validData,
			cpf: "123",
		});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(
				result.error.issues.some((issue) =>
					issue.message.includes("CPF deve conter 11 dígitos"),
				),
			).toBe(true);
		}
	});

	it("rejeita endereço com menos de 5 caracteres", () => {
		const result = PatientFormValidation.safeParse({
			...validData,
			address: "Rua",
		});
		expect(result.success).toBe(false);
	});

	it("aceita identificationDocument e imageProfile ausentes (opcionais)", () => {
		const result = PatientFormValidation.safeParse(validData);
		expect(result.success).toBe(true);
	});
});
