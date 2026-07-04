import { describe, expect, it } from "vitest";

import { professionalCertificateSchema } from "@/lib/schemas/professional/professional-certificate.schema";
import { professionalProfileStatusSchema } from "@/lib/schemas/professional/professional-profile-status.schema";
import { professionalRatingSchema } from "@/lib/schemas/professional/professional-rating.schema";
import { professionalResponseSchema } from "@/lib/schemas/professional/professional-response.schema";

describe("professionalProfileStatusSchema", () => {
	it("aceita valor válido", () => {
		expect(professionalProfileStatusSchema.safeParse("ACTIVE").success).toBe(
			true,
		);
	});

	it("rejeita valor inválido", () => {
		expect(professionalProfileStatusSchema.safeParse("INVALID").success).toBe(
			false,
		);
	});
});

describe("professionalRatingSchema", () => {
	const valid = {
		averageRating: 4.5,
		totalRatings: 10,
		distribution: { "5": 6, "4": 4 },
	};

	it("aceita objeto válido", () => {
		expect(professionalRatingSchema.safeParse(valid).success).toBe(true);
	});

	it("aceita averageRating nulo", () => {
		expect(
			professionalRatingSchema.safeParse({ ...valid, averageRating: null })
				.success,
		).toBe(true);
	});

	it("rejeita sem averageRating (obrigatório, mas nullable)", () => {
		const { averageRating, ...withoutAverage } = valid;
		expect(professionalRatingSchema.safeParse(withoutAverage).success).toBe(
			false,
		);
	});

	it("rejeita tipo inválido em distribution", () => {
		expect(
			professionalRatingSchema.safeParse({ ...valid, distribution: "5" })
				.success,
		).toBe(false);
	});
});

describe("professionalResponseSchema", () => {
	const valid = {
		id: "prof-1",
		userId: "user-1",
		specialty: "CARDIOLOGIA",
	};

	it("aceita objeto válido mínimo, com defaults para arrays", () => {
		const result = professionalResponseSchema.safeParse(valid);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.education).toEqual([]);
			expect(result.data.experience).toEqual([]);
			expect(result.data.certificates).toEqual([]);
			expect(result.data.acceptedPaymentMethods).toEqual([]);
		}
	});

	it("aceita education, experience e certificates preenchidos", () => {
		const result = professionalResponseSchema.safeParse({
			...valid,
			education: [
				{ degree: "Medicina", institution: "USP", graduationYear: 2010 },
			],
			experience: [
				{
					position: "Clínico Geral",
					institution: "Hospital X",
					startYear: 2011,
				},
			],
			certificates: [{ title: "Certificado ACLS" }],
		});
		expect(result.success).toBe(true);
	});

	it("rejeita sem specialty (obrigatório)", () => {
		const { specialty, ...withoutSpecialty } = valid;
		expect(professionalResponseSchema.safeParse(withoutSpecialty).success).toBe(
			false,
		);
	});

	it("rejeita status inválido", () => {
		expect(
			professionalResponseSchema.safeParse({ ...valid, status: "INVALID" })
				.success,
		).toBe(false);
	});
});

describe("professionalCertificateSchema", () => {
	it("aceita objeto válido mínimo", () => {
		expect(
			professionalCertificateSchema.safeParse({ title: "ACLS" }).success,
		).toBe(true);
	});

	it("rejeita title vazio", () => {
		expect(professionalCertificateSchema.safeParse({ title: "" }).success).toBe(
			false,
		);
	});

	it("aceita issueYear entre 1900 e 2100", () => {
		expect(
			professionalCertificateSchema.safeParse({
				title: "ACLS",
				issueYear: 1900,
			}).success,
		).toBe(true);
		expect(
			professionalCertificateSchema.safeParse({
				title: "ACLS",
				issueYear: 2100,
			}).success,
		).toBe(true);
	});

	it("rejeita issueYear fora do intervalo 1900-2100", () => {
		expect(
			professionalCertificateSchema.safeParse({
				title: "ACLS",
				issueYear: 1899,
			}).success,
		).toBe(false);
		expect(
			professionalCertificateSchema.safeParse({
				title: "ACLS",
				issueYear: 2101,
			}).success,
		).toBe(false);
	});

	it("aceita certificateUrl válida http/https", () => {
		expect(
			professionalCertificateSchema.safeParse({
				title: "ACLS",
				certificateUrl: "https://certs.example.com/a.pdf",
			}).success,
		).toBe(true);
	});

	it("rejeita certificateUrl que não começa com http/https", () => {
		expect(
			professionalCertificateSchema.safeParse({
				title: "ACLS",
				certificateUrl: "ftp://certs.example.com/a.pdf",
			}).success,
		).toBe(false);
	});
});
