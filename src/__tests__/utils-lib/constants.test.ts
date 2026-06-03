import { describe, expect, it } from "vitest";
import {
	GenderOptions,
	IdentificationTypes,
	StatusIcon,
} from "@/utils/constants";

describe("GenderOptions", () => {
	it("has 3 options", () => expect(GenderOptions).toHaveLength(3));
	it("contains MALE", () =>
		expect(GenderOptions.map((g) => g.value)).toContain("MALE"));
	it("contains FEMALE", () =>
		expect(GenderOptions.map((g) => g.value)).toContain("FEMALE"));
	it("contains OTHER", () =>
		expect(GenderOptions.map((g) => g.value)).toContain("OTHER"));
});

describe("IdentificationTypes", () => {
	it("is non-empty array", () =>
		expect(IdentificationTypes.length).toBeGreaterThan(0));
	it("all items are strings", () => {
		for (const item of IdentificationTypes) {
			expect(typeof item).toBe("string");
		}
	});
});

describe("StatusIcon", () => {
	it("CONFIRMED maps to check icon", () =>
		expect(StatusIcon.CONFIRMED).toContain("check"));
	it("PENDING maps to pending icon", () =>
		expect(StatusIcon.PENDING).toContain("pending"));
	it("CANCELED maps to cancelled icon", () =>
		expect(StatusIcon.CANCELED).toContain("cancelled"));
	it("lowercase keys also work", () => {
		expect(StatusIcon.confirmed).toBeDefined();
		expect(StatusIcon.pending).toBeDefined();
	});
});
