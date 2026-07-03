import { describe, expect, it } from "vitest";
import { EXAM_TYPE_OPTIONS } from "@/utils/constants/exam-types";
import { PROFESSIONAL_TYPE_LABELS } from "@/utils/constants/professional-types";

describe("EXAM_TYPE_OPTIONS", () => {
	it("each item has value and label", () => {
		expect(EXAM_TYPE_OPTIONS[0]).toHaveProperty("value");
		expect(EXAM_TYPE_OPTIONS[0]).toHaveProperty("label");
	});
	it("length matches EXAM_TYPE_LABELS count", () => {
		expect(EXAM_TYPE_OPTIONS.length).toBeGreaterThan(0);
	});
	it("PROFESSIONAL_TYPE_LABELS is non-empty sanity check", () => {
		expect(Object.keys(PROFESSIONAL_TYPE_LABELS).length).toBeGreaterThan(0);
	});
});
