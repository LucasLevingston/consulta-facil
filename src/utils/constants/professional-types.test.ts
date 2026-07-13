import { describe, expect, it } from "vitest";
import {
	PROFESSIONAL_TYPE_LABELS,
	PROFESSIONAL_TYPE_OPTIONS,
} from "./professional-types";

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
