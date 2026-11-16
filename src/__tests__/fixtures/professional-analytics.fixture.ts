import type { ProfessionalAnalytics } from "@/features/analytics";

/** API payload for GET /professionals/me/analytics shared by the analytics tests. */
export function makeProfessionalAnalytics(
	overrides: Partial<ProfessionalAnalytics> = {},
): ProfessionalAnalytics {
	return {
		period: "30d",
		from: "2026-10-17T12:00:00",
		to: "2026-11-16T12:00:00",
		revenue: {
			total: 4800,
			avgPerAppointment: 240,
			paidAppointments: 20,
			byMonth: [
				{ month: "2026-10", amount: 1200 },
				{ month: "2026-11", amount: 3600 },
			],
		},
		appointments: {
			total: 20,
			confirmed: 16,
			completed: 12,
			canceled: 3,
			pending: 1,
			cancellationRate: 0.15,
			byModality: { IN_PERSON: 12, ONLINE: 8 },
			byWeekday: [
				{ day: "MONDAY", count: 5 },
				{ day: "TUESDAY", count: 4 },
				{ day: "WEDNESDAY", count: 3 },
				{ day: "THURSDAY", count: 2 },
				{ day: "FRIDAY", count: 2 },
				{ day: "SATURDAY", count: 1 },
				{ day: "SUNDAY", count: 0 },
			],
		},
		ratings: {
			average: 4.7,
			total: 14,
			distribution: { "1": 0, "2": 0, "3": 1, "4": 3, "5": 10 },
		},
		topServices: [
			{ id: "svc-1", name: "Consulta geral", count: 12, revenue: 2400 },
			{ id: "svc-2", name: "Retorno", count: 5, revenue: 500 },
		],
		...overrides,
	};
}
