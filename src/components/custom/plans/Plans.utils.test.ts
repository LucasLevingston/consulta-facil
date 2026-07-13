import { describe, expect, it } from "vitest";
import { apiPlanToUiPlan } from "./Plans.utils";

const basePlan = {
	slug: "basic",
	name: "Básico",
	price: 99.9,
	tier: "BASIC",
	description: "Plano básico",
	features: ["Feature A"],
	maxAppointments: null,
};

describe("apiPlanToUiPlan", () => {
	it("uses slug as id and name as title", () => {
		const result = apiPlanToUiPlan(basePlan as never, null);
		expect(result.id).toBe("basic");
		expect(result.title).toBe("Básico");
	});

	it("formats non-zero price with pt-BR locale", () => {
		const result = apiPlanToUiPlan(basePlan as never, null);
		expect(result.monthlyEquiv).toBe("99,90");
		expect(result.totalPrice).toBe("99,90");
	});

	it("formats zero price as Grátis and 0,00", () => {
		const free = { ...basePlan, price: 0 };
		const result = apiPlanToUiPlan(free as never, null);
		expect(result.totalPrice).toBe("Grátis");
		expect(result.monthlyEquiv).toBe("0,00");
	});

	it("adds 'Consultas ilimitadas' when maxAppointments is null", () => {
		const result = apiPlanToUiPlan(basePlan as never, null);
		expect(result.features).toContain("Consultas ilimitadas");
	});

	it("adds 'Até N consultas/mês' when maxAppointments set", () => {
		const limited = { ...basePlan, maxAppointments: 5 };
		const result = apiPlanToUiPlan(limited as never, null);
		expect(result.features).toContain("Até 5 consultas/mês");
	});

	it("includes original features plus limit label", () => {
		const result = apiPlanToUiPlan(basePlan as never, null);
		expect(result.features).toContain("Feature A");
	});

	it("highlights PRO tier", () => {
		const pro = { ...basePlan, tier: "PRO" };
		const result = apiPlanToUiPlan(pro as never, null);
		expect(result.highlight).toBe(true);
	});

	it("does not highlight non-PRO tier", () => {
		const result = apiPlanToUiPlan(basePlan as never, null);
		expect(result.highlight).toBe(false);
	});

	it("passes icon through", () => {
		const icon = Symbol("icon");
		const result = apiPlanToUiPlan(basePlan as never, icon as never);
		expect(result.icon).toBe(icon);
	});

	it("uses empty string when description is null", () => {
		const noDesc = { ...basePlan, description: null };
		const result = apiPlanToUiPlan(noDesc as never, null);
		expect(result.description).toBe("");
	});
});
