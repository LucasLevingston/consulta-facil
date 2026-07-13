import { describe, expect, it } from "vitest";
import { GenderOptions } from "./gender-options";

describe("GenderOptions", () => {
	it("has 3 options", () => expect(GenderOptions).toHaveLength(3));
	it("contains MALE", () =>
		expect(GenderOptions.map((g) => g.value)).toContain("MALE"));
	it("contains FEMALE", () =>
		expect(GenderOptions.map((g) => g.value)).toContain("FEMALE"));
	it("contains OTHER", () =>
		expect(GenderOptions.map((g) => g.value)).toContain("OTHER"));
});
