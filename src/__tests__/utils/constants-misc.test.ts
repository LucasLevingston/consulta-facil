import { describe, expect, it } from "vitest";
import { JS_DAY_TO_DOW } from "@/utils/constants/day-to-dow";
import { DAYS } from "@/utils/constants/days-of-week";
import { ALL } from "@/utils/constants/filter-sentinels";
import { NOTIFICATION_ICON } from "@/utils/constants/notification-icon";
import { PLAN_LABELS } from "@/utils/constants/plan-labels";
import { RADIUS_OPTIONS } from "@/utils/constants/radius-options";

describe("DAYS", () => {
	it("has 7 days", () => {
		expect(DAYS).toHaveLength(7);
	});
	it("first key is MONDAY", () => {
		expect(DAYS[0].key).toBe("MONDAY");
	});
	it("last key is SUNDAY", () => {
		expect(DAYS[6].key).toBe("SUNDAY");
	});
	it("each item has key and label", () => {
		for (const d of DAYS) {
			expect(d.key).toBeDefined();
			expect(d.label).toBeDefined();
		}
	});
});

describe("JS_DAY_TO_DOW", () => {
	it("0 → SUNDAY", () => {
		expect(JS_DAY_TO_DOW[0]).toBe("SUNDAY");
	});
	it("1 → MONDAY", () => {
		expect(JS_DAY_TO_DOW[1]).toBe("MONDAY");
	});
	it("6 → SATURDAY", () => {
		expect(JS_DAY_TO_DOW[6]).toBe("SATURDAY");
	});
	it("3 → WEDNESDAY", () => {
		expect(JS_DAY_TO_DOW[3]).toBe("WEDNESDAY");
	});
});

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

describe("PLAN_LABELS", () => {
	it("monthly is 'Pro Mensal'", () => {
		expect(PLAN_LABELS.monthly).toBe("Pro Mensal");
	});
	it("yearly is 'Pro Anual'", () => {
		expect(PLAN_LABELS.yearly).toBe("Pro Anual");
	});
	it("clinic-monthly is 'Clínica Mensal'", () => {
		expect(PLAN_LABELS["clinic-monthly"]).toBe("Clínica Mensal");
	});
	it("clinic-yearly is 'Clínica Anual'", () => {
		expect(PLAN_LABELS["clinic-yearly"]).toBe("Clínica Anual");
	});
});

describe("filter-sentinels", () => {
	it("ALL sentinel is '__all__'", () => {
		expect(ALL).toBe("__all__");
	});
});

describe("RADIUS_OPTIONS", () => {
	it("has 4 options", () => {
		expect(RADIUS_OPTIONS).toHaveLength(4);
	});
	it("first option value is '10'", () => {
		expect(RADIUS_OPTIONS[0].value).toBe("10");
	});
	it("last option value is '100'", () => {
		expect(RADIUS_OPTIONS[3].value).toBe("100");
	});
	it("each option has value and label", () => {
		for (const opt of RADIUS_OPTIONS) {
			expect(opt.value).toBeDefined();
			expect(opt.label).toBeDefined();
		}
	});
});
