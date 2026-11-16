import { z } from "zod";

export const analyticsPeriodSchema = z.enum(["30d", "90d", "12m"]);
export type AnalyticsPeriod = z.infer<typeof analyticsPeriodSchema>;

export const monthlyRevenueSchema = z.object({
	month: z.string(),
	amount: z.number(),
});
export type MonthlyRevenue = z.infer<typeof monthlyRevenueSchema>;

export const weekdayCountSchema = z.object({
	day: z.string(),
	count: z.number(),
});
export type WeekdayCount = z.infer<typeof weekdayCountSchema>;

export const topServiceSchema = z.object({
	id: z.string(),
	name: z.string().nullable(),
	count: z.number(),
	revenue: z.number(),
});
export type TopService = z.infer<typeof topServiceSchema>;

export const professionalAnalyticsSchema = z.object({
	period: analyticsPeriodSchema,
	from: z.string(),
	to: z.string(),
	revenue: z.object({
		total: z.number(),
		avgPerAppointment: z.number(),
		paidAppointments: z.number(),
		byMonth: z.array(monthlyRevenueSchema),
	}),
	appointments: z.object({
		total: z.number(),
		confirmed: z.number(),
		completed: z.number(),
		canceled: z.number(),
		pending: z.number(),
		cancellationRate: z.number(),
		byModality: z.record(z.string(), z.number()),
		byWeekday: z.array(weekdayCountSchema),
	}),
	ratings: z.object({
		average: z.number().nullable(),
		total: z.number(),
		distribution: z.record(z.string(), z.number()),
	}),
	topServices: z.array(topServiceSchema),
});
export type ProfessionalAnalytics = z.infer<typeof professionalAnalyticsSchema>;
