import { describe, expect, it } from "vitest";
import { NOTIFICATION_ICON } from "./notification-icon";

describe("NOTIFICATION_ICON", () => {
	it("CLINIC_INVITE has an icon component", () => {
		expect(NOTIFICATION_ICON.CLINIC_INVITE.icon).toBeDefined();
	});
	it("APPOINTMENT_CANCELED color contains red", () => {
		expect(NOTIFICATION_ICON.APPOINTMENT_CANCELED.color).toContain("red");
	});
	it("GENERAL bg is 'bg-muted'", () => {
		expect(NOTIFICATION_ICON.GENERAL.bg).toBe("bg-muted");
	});
	it("APPOINTMENT_CONFIRMED color contains green", () => {
		expect(NOTIFICATION_ICON.APPOINTMENT_CONFIRMED.color).toContain("green");
	});
});
