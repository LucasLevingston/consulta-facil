import { describe, expect, it } from "vitest";
import { EXAM_TYPE_LABELS, EXAM_TYPE_OPTIONS } from "./exam-types";

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

describe("EXAM_TYPE_OPTIONS", () => {
	it("each item has value and label", () => {
		expect(EXAM_TYPE_OPTIONS[0]).toHaveProperty("value");
		expect(EXAM_TYPE_OPTIONS[0]).toHaveProperty("label");
	});
	it("length matches EXAM_TYPE_LABELS count", () => {
		expect(EXAM_TYPE_OPTIONS.length).toBeGreaterThan(0);
	});
});
