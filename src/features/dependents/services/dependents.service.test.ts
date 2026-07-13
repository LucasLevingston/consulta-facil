import { describe, expect, it } from "vitest";
import { dependentsService } from "./dependents.service";

const dep = { id: "d1", name: "Alice" } as never;
const depNoName = { id: "d2" } as never;

describe("dependentsService", () => {
	describe("canDelete", () => {
		it("returns true when dependent has an id", () => {
			expect(dependentsService.canDelete(dep)).toBe(true);
		});

		it("returns false when dependent has no id", () => {
			expect(dependentsService.canDelete({ id: "" } as never)).toBe(false);
		});
	});

	describe("getDisplayName", () => {
		it("returns the name when name is set", () => {
			expect(dependentsService.getDisplayName(dep)).toBe("Alice");
		});

		it("returns fallback when name is undefined", () => {
			expect(dependentsService.getDisplayName(depNoName)).toBe("Dependente");
		});
	});

	describe("isEditing", () => {
		it("returns true when current id matches target id", () => {
			expect(dependentsService.isEditing(dep, dep)).toBe(true);
		});

		it("returns false when ids differ", () => {
			expect(dependentsService.isEditing(dep, depNoName)).toBe(false);
		});

		it("returns false when current is null", () => {
			expect(dependentsService.isEditing(null, dep)).toBe(false);
		});
	});
});
