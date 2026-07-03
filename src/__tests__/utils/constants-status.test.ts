import { describe, expect, it } from "vitest";
import { STATUS_CLASS } from "@/utils/constants/appointment-status-class";
import { STATUS_CONFIG } from "@/utils/constants/appointment-status-config";
import { STATUS_LABEL } from "@/utils/constants/appointment-status-label";
import { GENDER_LABELS } from "@/utils/constants/gender-labels";

describe("STATUS_CONFIG (appointment)", () => {
	it("PENDING has secondary variant", () => {
		expect(STATUS_CONFIG.PENDING.variant).toBe("secondary");
	});
	it("CONFIRMED label is 'Confirmada'", () => {
		expect(STATUS_CONFIG.CONFIRMED.label).toBe("Confirmada");
	});
	it("CANCELED has destructive variant", () => {
		expect(STATUS_CONFIG.CANCELED.variant).toBe("destructive");
	});
	it("COMPLETED has outline variant", () => {
		expect(STATUS_CONFIG.COMPLETED.variant).toBe("outline");
	});
	it("has 6 statuses", () => {
		expect(Object.keys(STATUS_CONFIG)).toHaveLength(6);
	});
});

describe("STATUS_LABEL (appointment)", () => {
	it("PENDING is 'Pendente'", () => {
		expect(STATUS_LABEL.PENDING).toBe("Pendente");
	});
	it("CONFIRMED is 'Confirmada'", () => {
		expect(STATUS_LABEL.CONFIRMED).toBe("Confirmada");
	});
	it("CANCELED is 'Cancelada'", () => {
		expect(STATUS_LABEL.CANCELED).toBe("Cancelada");
	});
	it("COMPLETED is 'Concluída'", () => {
		expect(STATUS_LABEL.COMPLETED).toBe("Concluída");
	});
	it("CHECKED_IN is 'Check-in feito'", () => {
		expect(STATUS_LABEL.CHECKED_IN).toBe("Check-in feito");
	});
});

describe("STATUS_CLASS (appointment)", () => {
	it("PENDING includes amber colors", () => {
		expect(STATUS_CLASS.PENDING).toContain("amber");
	});
	it("COMPLETED includes emerald colors", () => {
		expect(STATUS_CLASS.COMPLETED).toContain("emerald");
	});
	it("CANCELED includes red colors", () => {
		expect(STATUS_CLASS.CANCELED).toContain("red");
	});
	it("CONFIRMED includes blue colors", () => {
		expect(STATUS_CLASS.CONFIRMED).toContain("blue");
	});
	it("IN_PROGRESS includes purple colors", () => {
		expect(STATUS_CLASS.IN_PROGRESS).toContain("purple");
	});
});

describe("GENDER_LABELS", () => {
	it("MALE is 'Masculino'", () => {
		expect(GENDER_LABELS.MALE).toBe("Masculino");
	});
	it("FEMALE is 'Feminino'", () => {
		expect(GENDER_LABELS.FEMALE).toBe("Feminino");
	});
	it("OTHER is 'Outro'", () => {
		expect(GENDER_LABELS.OTHER).toBe("Outro");
	});
	it("has exactly 3 keys", () => {
		expect(Object.keys(GENDER_LABELS)).toHaveLength(3);
	});
});
