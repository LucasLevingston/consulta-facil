import { describe, expect, it } from "vitest";
import { SETTINGS_LINKS } from "./settings-links";

describe("SETTINGS_LINKS", () => {
	it("is non-empty array", () => {
		expect(SETTINGS_LINKS.length).toBeGreaterThan(0);
	});
	it("first link points to /settings", () => {
		expect(SETTINGS_LINKS[0].href).toBe("/settings");
	});
	it("each link has href, label and icon", () => {
		for (const link of SETTINGS_LINKS) {
			expect(link.href).toBeDefined();
			expect(link.label).toBeDefined();
			expect(link.icon).toBeDefined();
		}
	});
	it("schedule link is restricted to PROFESSIONAL role", () => {
		const scheduleLink = SETTINGS_LINKS.find(
			(l) => l.href === "/settings/schedule",
		);
		expect(scheduleLink?.roles).toContain("PROFESSIONAL");
	});
});
