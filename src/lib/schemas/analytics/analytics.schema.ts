import { z } from "zod";

export const kpiSchema = z.object({
	label: z.string(),
	value: z.number(),
	unit: z.string(),
});
export type Kpi = z.infer<typeof kpiSchema>;

export const timeSeriesSchema = z.object({
	label: z.string(),
	value: z.number(),
});
export type TimeSeries = z.infer<typeof timeSeriesSchema>;

export const breakdownSchema = z.object({
	label: z.string(),
	count: z.number(),
	percentage: z.number(),
});
export type Breakdown = z.infer<typeof breakdownSchema>;

export const financialAnalyticsSchema = z.object({
	kpis: z.array(kpiSchema),
	revenueSeries: z.array(timeSeriesSchema),
	statusBreakdown: z.array(breakdownSchema),
	paymentTypeBreakdown: z.array(breakdownSchema),
});
export type FinancialAnalytics = z.infer<typeof financialAnalyticsSchema>;

export const userAnalyticsSchema = z.object({
	kpis: z.array(kpiSchema),
	growthSeries: z.array(timeSeriesSchema),
	roleBreakdown: z.array(breakdownSchema),
});
export type UserAnalytics = z.infer<typeof userAnalyticsSchema>;

export const appointmentAnalyticsSchema = z.object({
	kpis: z.array(kpiSchema),
	appointmentSeries: z.array(timeSeriesSchema),
	statusBreakdown: z.array(breakdownSchema),
	modalityBreakdown: z.array(breakdownSchema),
});
export type AppointmentAnalytics = z.infer<typeof appointmentAnalyticsSchema>;

export const referralAnalyticsSchema = z.object({
	kpis: z.array(kpiSchema),
	referralSeries: z.array(timeSeriesSchema),
	statusBreakdown: z.array(breakdownSchema),
});
export type ReferralAnalytics = z.infer<typeof referralAnalyticsSchema>;

export const subscriptionAnalyticsSchema = z.object({
	kpis: z.array(kpiSchema),
	statusBreakdown: z.array(breakdownSchema),
	planBreakdown: z.array(breakdownSchema),
});
export type SubscriptionAnalytics = z.infer<typeof subscriptionAnalyticsSchema>;
