import { describe, expect, it } from "vitest";
import { EXAM_TYPE_LABELS } from "@/utils/constants/exam-types";
import {
	PROFESSION_SPECIALTIES,
	professions,
	SPECIALTY_LABELS,
	specialties,
} from "@/utils/constants/profession-specialties";
import {
	PROFESSIONAL_TYPE_LABELS,
	PROFESSIONAL_TYPE_OPTIONS,
} from "@/utils/constants/professional-types";

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

describe("PROFESSIONAL_TYPE_LABELS", () => {
	it("MEDICO is 'Médico'", () => {
		expect(PROFESSIONAL_TYPE_LABELS.MEDICO).toBe("Médico");
	});
	it("DENTISTA is 'Dentista'", () => {
		expect(PROFESSIONAL_TYPE_LABELS.DENTISTA).toBe("Dentista");
	});
	it("VETERINARIO is 'Veterinário'", () => {
		expect(PROFESSIONAL_TYPE_LABELS.VETERINARIO).toBe("Veterinário");
	});
	it("is non-empty", () => {
		expect(Object.keys(PROFESSIONAL_TYPE_LABELS).length).toBeGreaterThan(0);
	});
});

describe("PROFESSIONAL_TYPE_OPTIONS", () => {
	it("each item has value and label", () => {
		expect(PROFESSIONAL_TYPE_OPTIONS[0]).toHaveProperty("value");
		expect(PROFESSIONAL_TYPE_OPTIONS[0]).toHaveProperty("label");
	});
	it("length matches PROFESSIONAL_TYPE_LABELS count", () => {
		expect(PROFESSIONAL_TYPE_OPTIONS).toHaveLength(
			Object.keys(PROFESSIONAL_TYPE_LABELS).length,
		);
	});
});

describe("EXAM_TYPE_LABELS", () => {
	it("HEMOGRAMA_COMPLETO is 'Hemograma Completo'", () => {
		expect(EXAM_TYPE_LABELS.HEMOGRAMA_COMPLETO).toBe("Hemograma Completo");
	});
	it("RAIO_X is 'Raio-X'", () => {
		expect(EXAM_TYPE_LABELS.RAIO_X).toBe("Raio-X");
	});
	it("is non-empty", () => {
		expect(Object.keys(EXAM_TYPE_LABELS).length).toBeGreaterThan(0);
	});
});
