import { describe, expect, it } from "vitest";
import {
	breakdownSchema,
	financialAnalyticsSchema,
	kpiSchema,
	timeSeriesSchema,
	userAnalyticsSchema,
} from "@/lib/schemas/analytics/analytics.schema";

const kpi = { label: "Revenue", value: 1000, unit: "BRL" };
const ts = { label: "Jan", value: 500 };
const bd = { label: "PAID", count: 10, percentage: 0.5 };

describe("kpiSchema", () => {
	it("accepts valid data", () => {
		expect(kpiSchema.safeParse(kpi).success).toBe(true);
	});
	it("rejects missing fields", () => {
		expect(kpiSchema.safeParse({}).success).toBe(false);
	});
	it("rejects wrong type for value", () => {
		expect(
			kpiSchema.safeParse({ label: "X", value: "1000", unit: "BRL" }).success,
		).toBe(false);
	});
});

describe("timeSeriesSchema", () => {
	it("accepts valid data", () => {
		expect(timeSeriesSchema.safeParse(ts).success).toBe(true);
	});
	it("rejects missing fields", () => {
		expect(timeSeriesSchema.safeParse({}).success).toBe(false);
	});
	it("rejects wrong type for value", () => {
		expect(
			timeSeriesSchema.safeParse({ label: "Jan", value: "500" }).success,
		).toBe(false);
	});
});

describe("breakdownSchema", () => {
	it("accepts valid data", () => {
		expect(breakdownSchema.safeParse(bd).success).toBe(true);
	});
	it("rejects missing fields", () => {
		expect(breakdownSchema.safeParse({}).success).toBe(false);
	});
});

describe("financialAnalyticsSchema", () => {
	it("accepts valid data", () => {
		const result = financialAnalyticsSchema.safeParse({
			kpis: [kpi],
			revenueSeries: [ts],
			statusBreakdown: [bd],
			paymentTypeBreakdown: [bd],
		});
		expect(result.success).toBe(true);
	});
	it("accepts empty arrays", () => {
		const result = financialAnalyticsSchema.safeParse({
			kpis: [],
			revenueSeries: [],
			statusBreakdown: [],
			paymentTypeBreakdown: [],
		});
		expect(result.success).toBe(true);
	});
	it("rejects missing fields", () => {
		expect(financialAnalyticsSchema.safeParse({}).success).toBe(false);
	});
});

describe("userAnalyticsSchema", () => {
	it("accepts valid data", () => {
		const result = userAnalyticsSchema.safeParse({
			kpis: [kpi],
			growthSeries: [ts],
			roleBreakdown: [bd],
		});
		expect(result.success).toBe(true);
	});
	it("rejects missing fields", () => {
		expect(userAnalyticsSchema.safeParse({}).success).toBe(false);
	});
});
