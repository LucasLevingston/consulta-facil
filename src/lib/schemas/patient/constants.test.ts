import { describe, expect, it } from "vitest";
import { DOCUMENT_TYPE_LABELS, RELATIONSHIP_LABELS } from "./constants";
import { emergencyContactRelationshipSchema } from "./emergency-contact.schema";
import { documentTypeSchema } from "./patient-document.schema";

describe("constants (labels)", () => {
	it("DOCUMENT_TYPE_LABELS contém rótulo para cada valor de documentTypeSchema", () => {
		for (const value of documentTypeSchema.options) {
			expect(DOCUMENT_TYPE_LABELS[value]).toBeDefined();
		}
	});

	it("RELATIONSHIP_LABELS contém rótulo para cada valor de emergencyContactRelationshipSchema", () => {
		for (const value of emergencyContactRelationshipSchema.options) {
			expect(RELATIONSHIP_LABELS[value]).toBeDefined();
		}
	});
});
