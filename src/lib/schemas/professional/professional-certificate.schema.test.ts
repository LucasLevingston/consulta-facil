import { describe, expect, it } from "vitest";
import { professionalCertificateSchema } from "./professional-certificate.schema";

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
