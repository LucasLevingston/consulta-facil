import { describe, expect, it } from "vitest";
import { makeProfessionalAnalytics } from "@/__tests__/fixtures/professional-analytics.fixture";
import { toProfessionalKpis } from "./to-professional-kpis";

describe("toProfessionalKpis", () => {
	it("builds revenue, volume, cancellation and rating KPIs", () => {
		expect(toProfessionalKpis(makeProfessionalAnalytics())).toEqual([
			{ label: "Receita no período", value: 4800, unit: "BRL" },
			{ label: "Ticket médio", value: 240, unit: "BRL" },
			{ label: "Consultas", value: 20, unit: "count" },
			{ label: "Taxa de cancelamento", value: 15, unit: "%" },
			{ label: "Avaliações", value: 14, unit: "count" },
			{ label: "Nota média", value: 4.7, unit: "count" },
		]);
	});

	it("omits the average rating KPI when nothing was rated", () => {
		const kpis = toProfessionalKpis(
			makeProfessionalAnalytics({
				ratings: { average: null, total: 0, distribution: {} },
			}),
		);

		expect(kpis.map((k) => k.label)).not.toContain("Nota média");
		expect(kpis.find((k) => k.label === "Avaliações")?.value).toBe(0);
	});
});
