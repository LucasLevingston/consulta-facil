import type { Kpi, ProfessionalAnalytics } from "@/features/analytics";

export function toProfessionalKpis(data: ProfessionalAnalytics): Kpi[] {
	const kpis: Kpi[] = [
		{ label: "Receita no período", value: data.revenue.total, unit: "BRL" },
		{
			label: "Ticket médio",
			value: data.revenue.avgPerAppointment,
			unit: "BRL",
		},
		{ label: "Consultas", value: data.appointments.total, unit: "count" },
		{
			label: "Taxa de cancelamento",
			value: data.appointments.cancellationRate * 100,
			unit: "%",
		},
		{ label: "Avaliações", value: data.ratings.total, unit: "count" },
	];
	if (data.ratings.average !== null) {
		kpis.push({
			label: "Nota média",
			value: data.ratings.average,
			unit: "count",
		});
	}
	return kpis;
}
