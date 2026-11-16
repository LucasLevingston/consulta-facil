import { describe, expect, it } from "vitest";
import { makeProfessionalAnalytics } from "@/__tests__/fixtures/professional-analytics.fixture";
import {
	analyticsPeriodSchema,
	professionalAnalyticsSchema,
	topServiceSchema,
} from "./professional-analytics.schema";

describe("analyticsPeriodSchema", () => {
	it.each(["30d", "90d", "12m"])("accepts %s", (period) => {
		expect(analyticsPeriodSchema.safeParse(period).success).toBe(true);
	});

	it("rejects periods the API does not support", () => {
		expect(analyticsPeriodSchema.safeParse("7d").success).toBe(false);
	});
});

describe("professionalAnalyticsSchema", () => {
	it("accepts the API payload", () => {
		expect(
			professionalAnalyticsSchema.safeParse(makeProfessionalAnalytics())
				.success,
		).toBe(true);
	});

	it("accepts a period without ratings (average null)", () => {
		const data = makeProfessionalAnalytics({
			ratings: { average: null, total: 0, distribution: {} },
		});
		expect(professionalAnalyticsSchema.safeParse(data).success).toBe(true);
	});

	it("rejects a payload missing the revenue block", () => {
		const { revenue: _revenue, ...rest } = makeProfessionalAnalytics();
		expect(professionalAnalyticsSchema.safeParse(rest).success).toBe(false);
	});

	it("rejects non-numeric counts", () => {
		const data = makeProfessionalAnalytics();
		const broken = {
			...data,
			appointments: { ...data.appointments, total: "20" },
		};
		expect(professionalAnalyticsSchema.safeParse(broken).success).toBe(false);
	});
});

describe("topServiceSchema", () => {
	it("allows services without a name", () => {
		expect(
			topServiceSchema.safeParse({
				id: "svc-9",
				name: null,
				count: 1,
				revenue: 0,
			}).success,
		).toBe(true);
	});
});
