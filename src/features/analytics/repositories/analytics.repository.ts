import { api } from "@/config/api";
import type {
	AppointmentAnalytics,
	FinancialAnalytics,
	ReferralAnalytics,
	SubscriptionAnalytics,
	UserAnalytics,
} from "@/lib/schemas/analytics/analytics.schema";

export const analyticsRepository = {
	getFinancial: async (): Promise<FinancialAnalytics> => {
		const res = await api.get<FinancialAnalytics>("/admin/analytics/financial");
		return res.data;
	},

	getUsers: async (): Promise<UserAnalytics> => {
		const res = await api.get<UserAnalytics>("/admin/analytics/users");
		return res.data;
	},

	getAppointments: async (): Promise<AppointmentAnalytics> => {
		const res = await api.get<AppointmentAnalytics>(
			"/admin/analytics/appointments",
		);
		return res.data;
	},

	getReferrals: async (): Promise<ReferralAnalytics> => {
		const res = await api.get<ReferralAnalytics>("/admin/analytics/referrals");
		return res.data;
	},

	getSubscriptions: async (): Promise<SubscriptionAnalytics> => {
		const res = await api.get<SubscriptionAnalytics>(
			"/admin/analytics/subscriptions",
		);
		return res.data;
	},
};
