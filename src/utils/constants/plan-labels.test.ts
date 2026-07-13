import { describe, expect, it } from "vitest";
import { PLAN_LABELS } from "./plan-labels";

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
