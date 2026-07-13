import { describe, expect, it } from "vitest";
import { GENDER_LABELS } from "./gender-labels";

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
