import { api } from "@/config/api";
import type {
	AnalyticsPeriod,
	ProfessionalAnalytics,
} from "@/lib/schemas/analytics/professional-analytics.schema";

export const professionalAnalyticsRepository = {
	getMine: async (period: AnalyticsPeriod): Promise<ProfessionalAnalytics> => {
		const res = await api.get<ProfessionalAnalytics>(
			"/professionals/me/analytics",
			{ params: { period } },
		);
		return res.data;
	},
};
