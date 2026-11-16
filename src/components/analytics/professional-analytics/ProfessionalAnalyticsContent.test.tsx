import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { makeProfessionalAnalytics } from "@/__tests__/fixtures/professional-analytics.fixture";

// Recharts needs real layout; the chart wrappers are covered by their own tests.
// Here we only check which data each chart receives.
vi.mock("@/components/analytics/charts/AnalyticsLineChart", () => ({
	AnalyticsLineChart: ({
		data,
	}: {
		data: { label: string; value: number }[];
	}) => (
		<ul aria-label="linha">
			{data.map((p) => (
				<li key={p.label}>{`${p.label}=${p.value}`}</li>
			))}
		</ul>
	),
}));
vi.mock("@/components/analytics/charts/AnalyticsBarChart", () => ({
	AnalyticsBarChart: ({
		data,
	}: {
		data: { label: string; count: number }[];
	}) => (
		<ul aria-label="barras">
			{data.map((p) => (
				<li key={p.label}>{`${p.label}=${p.count}`}</li>
			))}
		</ul>
	),
}));
vi.mock("@/components/analytics/charts/AnalyticsDonutChart", () => ({
	AnalyticsDonutChart: ({
		data,
	}: {
		data: { label: string; percentage: number }[];
	}) => (
		<ul aria-label="rosca">
			{data.map((p) => (
				<li key={p.label}>{`${p.label}=${p.percentage}%`}</li>
			))}
		</ul>
	),
}));

import { ProfessionalAnalyticsContent } from "./ProfessionalAnalyticsContent";

describe("ProfessionalAnalyticsContent", () => {
	it("renders the KPI cards", () => {
		render(<ProfessionalAnalyticsContent data={makeProfessionalAnalytics()} />);

		expect(screen.getByText("Receita no período")).toBeInTheDocument();
		expect(screen.getByText(/4\.800,00/)).toBeInTheDocument();
		expect(screen.getByText("Taxa de cancelamento")).toBeInTheDocument();
		expect(screen.getByText("15.0%")).toBeInTheDocument();
		expect(screen.getByText("Nota média")).toBeInTheDocument();
	});

	it("feeds the revenue chart with MM/yyyy labels", () => {
		render(<ProfessionalAnalyticsContent data={makeProfessionalAnalytics()} />);

		const line = screen.getByRole("list", { name: "linha" });
		expect(within(line).getByText("10/2026=1200")).toBeInTheDocument();
		expect(within(line).getByText("11/2026=3600")).toBeInTheDocument();
	});

	it("translates weekdays, modalities and rating stars", () => {
		render(<ProfessionalAnalyticsContent data={makeProfessionalAnalytics()} />);

		const [weekdays, ratings] = screen.getAllByRole("list", { name: "barras" });
		expect(within(weekdays).getByText("Seg=5")).toBeInTheDocument();
		expect(within(weekdays).getByText("Dom=0")).toBeInTheDocument();
		expect(within(ratings).getAllByRole("listitem")[0]).toHaveTextContent(
			"5 ★=10",
		);
		const donut = screen.getByRole("list", { name: "rosca" });
		expect(within(donut).getByText("Presencial=60%")).toBeInTheDocument();
		expect(within(donut).getByText("Online=40%")).toBeInTheDocument();
	});

	it("lists the top services", () => {
		render(<ProfessionalAnalyticsContent data={makeProfessionalAnalytics()} />);

		expect(screen.getByText("Serviços mais procurados")).toBeInTheDocument();
		expect(screen.getByText("Consulta geral")).toBeInTheDocument();
		expect(screen.getByText("Retorno")).toBeInTheDocument();
	});

	it("handles a period without ratings or services", () => {
		render(
			<ProfessionalAnalyticsContent
				data={makeProfessionalAnalytics({
					ratings: { average: null, total: 0, distribution: {} },
					topServices: [],
				})}
			/>,
		);

		expect(screen.queryByText("Nota média")).not.toBeInTheDocument();
		expect(
			screen.getByText("Nenhum serviço agendado no período."),
		).toBeInTheDocument();
		const [, ratings] = screen.getAllByRole("list", { name: "barras" });
		expect(within(ratings).getAllByRole("listitem")).toHaveLength(5);
	});
});
