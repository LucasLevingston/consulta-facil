import { describe, expect, it } from "vitest";
import { STATUS_CLASS } from "./appointment-status-class";

describe("STATUS_CLASS (appointment)", () => {
	it("PENDING includes amber colors", () => {
		expect(STATUS_CLASS.PENDING).toContain("amber");
	});
	it("COMPLETED includes emerald colors", () => {
		expect(STATUS_CLASS.COMPLETED).toContain("emerald");
	});
	it("CANCELED includes red colors", () => {
		expect(STATUS_CLASS.CANCELED).toContain("red");
	});
	it("CONFIRMED includes blue colors", () => {
		expect(STATUS_CLASS.CONFIRMED).toContain("blue");
	});
	it("IN_PROGRESS includes purple colors", () => {
		expect(STATUS_CLASS.IN_PROGRESS).toContain("purple");
	});
});
