import { describe, expect, it } from "vitest";
import { BLOOD_TYPE_LABELS } from "./blood-type-labels";

describe("BLOOD_TYPE_LABELS", () => {
	it("A_POSITIVE is 'A+'", () => {
		expect(BLOOD_TYPE_LABELS.A_POSITIVE).toBe("A+");
	});
	it("A_NEGATIVE is 'A-'", () => {
		expect(BLOOD_TYPE_LABELS.A_NEGATIVE).toBe("A-");
	});
	it("O_NEGATIVE is 'O-'", () => {
		expect(BLOOD_TYPE_LABELS.O_NEGATIVE).toBe("O-");
	});
	it("AB_POSITIVE is 'AB+'", () => {
		expect(BLOOD_TYPE_LABELS.AB_POSITIVE).toBe("AB+");
	});
	it("has 8 blood types", () => {
		expect(Object.keys(BLOOD_TYPE_LABELS)).toHaveLength(8);
	});
});
