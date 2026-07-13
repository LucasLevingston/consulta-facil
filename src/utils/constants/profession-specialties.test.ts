import { describe, expect, it } from "vitest";
import {
	PROFESSION_SPECIALTIES,
	professions,
	SPECIALTY_LABELS,
	specialties,
} from "./profession-specialties";

describe("SPECIALTY_LABELS", () => {
	it("CLINICA_GERAL is 'Clínica Geral'", () => {
		expect(SPECIALTY_LABELS.CLINICA_GERAL).toBe("Clínica Geral");
	});
	it("CARDIOLOGIA is 'Cardiologia'", () => {
		expect(SPECIALTY_LABELS.CARDIOLOGIA).toBe("Cardiologia");
	});
	it("TCC maps correctly", () => {
		expect(SPECIALTY_LABELS.TCC).toBe("TCC (Terapia Cognitivo-Comportamental)");
	});
	it("is non-empty", () => {
		expect(Object.keys(SPECIALTY_LABELS).length).toBeGreaterThan(0);
	});
});

describe("PROFESSION_SPECIALTIES", () => {
	it("MEDICO has specialties", () => {
		expect(PROFESSION_SPECIALTIES.MEDICO.length).toBeGreaterThan(0);
	});
	it("DENTISTA includes ODONTOLOGIA_GERAL", () => {
		expect(PROFESSION_SPECIALTIES.DENTISTA).toContain("ODONTOLOGIA_GERAL");
	});
	it("has 10 professions", () => {
		expect(Object.keys(PROFESSION_SPECIALTIES)).toHaveLength(10);
	});
	it("PSICOLOGO includes TCC", () => {
		expect(PROFESSION_SPECIALTIES.PSICOLOGO).toContain("TCC");
	});
});

describe("professions and specialties", () => {
	it("professions is non-empty", () => {
		expect(professions.length).toBeGreaterThan(0);
	});
	it("specialties is non-empty", () => {
		expect(specialties.length).toBeGreaterThan(0);
	});
	it("professions includes MEDICO", () => {
		expect(professions).toContain("MEDICO");
	});
	it("specialties includes CARDIOLOGIA", () => {
		expect(specialties).toContain("CARDIOLOGIA");
	});
});
