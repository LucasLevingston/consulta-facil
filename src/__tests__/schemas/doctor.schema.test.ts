import { describe, expect, it } from "vitest";

import { createDoctorSchema } from "@/lib/schemas/doctor/create-professional.schema";

describe("createDoctorSchema", () => {
	const valid = {
		profession: "MEDICO",
		specialty: "CARDIOLOGIA",
		licenseNumber: "CRM-SP-12345",
	};

	it("aceita dados mínimos válidos", () => {
		expect(createDoctorSchema.safeParse(valid).success).toBe(true);
	});

	it("aceita todos os campos opcionais", () => {
		const result = createDoctorSchema.safeParse({
			...valid,
			name: "Dr. João Silva",
			email: "joao@clinica.com",
			phone: "11999990000",
		});
		expect(result.success).toBe(true);
	});

	it("rejeita especialidade com menos de 3 caracteres", () => {
		const result = createDoctorSchema.safeParse({ ...valid, specialty: "AB" });
		expect(result.success).toBe(false);
		expect(result.error?.flatten().fieldErrors.specialty).toBeDefined();
	});

	it("rejeita especialidade com mais de 100 caracteres", () => {
		const result = createDoctorSchema.safeParse({
			...valid,
			specialty: "A".repeat(101),
		});
		expect(result.success).toBe(false);
		expect(result.error?.flatten().fieldErrors.specialty).toBeDefined();
	});

	it("rejeita número de registro com menos de 5 caracteres", () => {
		const result = createDoctorSchema.safeParse({
			...valid,
			licenseNumber: "CRM1",
		});
		expect(result.success).toBe(false);
		expect(result.error?.flatten().fieldErrors.licenseNumber).toBeDefined();
	});

	it("rejeita número de registro com mais de 50 caracteres", () => {
		const result = createDoctorSchema.safeParse({
			...valid,
			licenseNumber: "A".repeat(51),
		});
		expect(result.success).toBe(false);
		expect(result.error?.flatten().fieldErrors.licenseNumber).toBeDefined();
	});

	it("rejeita e-mail inválido quando fornecido", () => {
		const result = createDoctorSchema.safeParse({
			...valid,
			email: "nao-e-email",
		});
		expect(result.success).toBe(false);
		expect(result.error?.flatten().fieldErrors.email).toBeDefined();
	});

	it("rejeita objeto sem campos obrigatórios", () => {
		expect(createDoctorSchema.safeParse({}).success).toBe(false);
	});
});
