import { describe, expect, it } from "vitest";
import { analyticsKeys } from "./analytics-keys";

describe("analyticsKeys", () => {
	it("scopes every admin key under 'analytics'", () => {
		expect(analyticsKeys.financial()).toEqual(["analytics", "financial"]);
		expect(analyticsKeys.users()).toEqual(["analytics", "users"]);
		expect(analyticsKeys.appointments()).toEqual(["analytics", "appointments"]);
		expect(analyticsKeys.referrals()).toEqual(["analytics", "referrals"]);
		expect(analyticsKeys.subscriptions()).toEqual([
			"analytics",
			"subscriptions",
		]);
	});

	it("keys professional analytics by period so each window is cached separately", () => {
		expect(analyticsKeys.professional("30d")).toEqual([
			"analytics",
			"professional",
			"30d",
		]);
		expect(analyticsKeys.professional("12m")).not.toEqual(
			analyticsKeys.professional("30d"),
		);
	});
});
