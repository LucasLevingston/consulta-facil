import { describe, expect, it } from "vitest";

describe("STAR_RATING_LABELS", () => {
	it("possui labels para as notas de 1 a 5", async () => {
		const { STAR_RATING_LABELS } = await import("./star-rating-labels");
		for (let i = 1; i <= 5; i++) {
			expect(typeof STAR_RATING_LABELS[i]).toBe("string");
			expect(STAR_RATING_LABELS[i].length).toBeGreaterThan(0);
		}
		expect(Object.keys(STAR_RATING_LABELS)).toHaveLength(5);
	});
});
