import { describe, expect, it } from "vitest";
import { StatusIcon } from "./appointment-status-icon";

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
