import { describe, expect, it } from "vitest";
import { RELATIONSHIP_LABELS } from "./relationship-labels";

describe("RELATIONSHIP_LABELS", () => {
	it("CHILD is 'Filho(a)'", () => {
		expect(RELATIONSHIP_LABELS.CHILD).toBe("Filho(a)");
	});
	it("SPOUSE is 'Cônjuge'", () => {
		expect(RELATIONSHIP_LABELS.SPOUSE).toBe("Cônjuge");
	});
	it("OTHER is 'Outro'", () => {
		expect(RELATIONSHIP_LABELS.OTHER).toBe("Outro");
	});
	it("has PARENT and SIBLING keys", () => {
		expect(RELATIONSHIP_LABELS.PARENT).toBeDefined();
		expect(RELATIONSHIP_LABELS.SIBLING).toBeDefined();
	});
});
