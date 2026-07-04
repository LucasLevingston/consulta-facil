import { describe, expect, it } from "vitest";
import { getInitials } from "@/lib/utils/get-initials";

describe("getInitials", () => {
	it("null → ?", () => expect(getInitials(null)).toBe("?"));
	it("undefined → ?", () => expect(getInitials(undefined)).toBe("?"));

	it("single name → first letter uppercase", () => {
		expect(getInitials("João")).toBe("J");
	});

	it("two names → two initials uppercase", () => {
		expect(getInitials("Maria Silva")).toBe("MS");
	});

	it("three names → only first two initials", () => {
		expect(getInitials("Ana Beatriz Costa")).toBe("AB");
	});

	it("lowercase input → uppercase result", () => {
		expect(getInitials("alice bob")).toBe("AB");
	});

	it("empty string → empty (chain evaluates to empty string)", () => {
		// "".split(" ") → [""], map n[0] → [undefined], join → "", slice → "", toUpperCase → ""
		// ?? "?" only catches null/undefined, not ""
		expect(getInitials("")).toBe("");
	});
});
