import { describe, expect, it } from "vitest";
import {
	appointmentAnalyticsSchema,
	referralAnalyticsSchema,
	subscriptionAnalyticsSchema,
} from "@/lib/schemas/analytics/analytics.schema";

const kpi = { label: "Revenue", value: 1000, unit: "BRL" };
const ts = { label: "Jan", value: 500 };
const bd = { label: "PAID", count: 10, percentage: 0.5 };

describe("appointmentAnalyticsSchema", () => {
	it("accepts valid data", () => {
		const result = appointmentAnalyticsSchema.safeParse({
			kpis: [kpi],
			appointmentSeries: [ts],
			statusBreakdown: [bd],
			modalityBreakdown: [bd],
		});
		expect(result.success).toBe(true);
	});
	it("rejects missing fields", () => {
		expect(appointmentAnalyticsSchema.safeParse({}).success).toBe(false);
	});
});

describe("referralAnalyticsSchema", () => {
	it("accepts valid data", () => {
		const result = referralAnalyticsSchema.safeParse({
			kpis: [kpi],
			referralSeries: [ts],
			statusBreakdown: [bd],
		});
		expect(result.success).toBe(true);
	});
	it("rejects missing fields", () => {
		expect(referralAnalyticsSchema.safeParse({}).success).toBe(false);
	});
});

describe("subscriptionAnalyticsSchema", () => {
	it("accepts valid data", () => {
		const result = subscriptionAnalyticsSchema.safeParse({
			kpis: [kpi],
			statusBreakdown: [bd],
			planBreakdown: [bd],
		});
		expect(result.success).toBe(true);
	});
	it("rejects missing fields", () => {
		expect(subscriptionAnalyticsSchema.safeParse({}).success).toBe(false);
	});
});
