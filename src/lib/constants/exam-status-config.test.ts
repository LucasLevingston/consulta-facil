import { describe, expect, it } from "vitest";

describe("EXAM_STATUS_CONFIG", () => {
	it("possui as chaves esperadas com label e variant válidos", async () => {
		const { EXAM_STATUS_CONFIG } = await import("./exam-status-config");
		const expectedKeys = ["PENDING", "SCHEDULED", "UPLOADED", "REVIEWED"];
		expect(Object.keys(EXAM_STATUS_CONFIG).sort()).toEqual(expectedKeys.sort());

		const allowedVariants = ["default", "secondary", "outline"];
		for (const key of expectedKeys) {
			const entry = EXAM_STATUS_CONFIG[key as keyof typeof EXAM_STATUS_CONFIG];
			expect(typeof entry.label).toBe("string");
			expect(entry.label.length).toBeGreaterThan(0);
			expect(allowedVariants).toContain(entry.variant);
		}
	});
});
