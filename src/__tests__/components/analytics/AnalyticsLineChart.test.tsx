import { render } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { AnalyticsLineChart } from "@/components/analytics/charts/AnalyticsLineChart";
import type { TimeSeries } from "@/features/analytics";

// jsdom não implementa ResizeObserver, mas o recharts (ResponsiveContainer)
// depende dele para medir o container do grafico.
beforeAll(() => {
	global.ResizeObserver = class {
		observe = vi.fn();
		unobserve = vi.fn();
		disconnect = vi.fn();
	} as unknown as typeof ResizeObserver;
});

describe("AnalyticsLineChart", () => {
	const data: TimeSeries[] = [
		{ label: "Jan", value: 100 },
		{ label: "Fev", value: 200 },
	];

	it("renderiza o grafico de linha sem quebrar quando ha dados", () => {
		const { container } = render(<AnalyticsLineChart data={data} />);

		expect(
			container.querySelector(".recharts-responsive-container"),
		).toBeTruthy();
	});

	it("renderiza sem quebrar quando a lista de dados esta vazia", () => {
		const { container } = render(<AnalyticsLineChart data={[]} />);

		expect(
			container.querySelector(".recharts-responsive-container"),
		).toBeTruthy();
	});

	it("aceita um valueFormatter customizado sem lancar erros", () => {
		const { container } = render(
			<AnalyticsLineChart
				data={data}
				dataKey="value"
				label="Receita"
				valueFormatter={(v) => `R$ ${v}`}
			/>,
		);

		expect(
			container.querySelector(".recharts-responsive-container"),
		).toBeTruthy();
	});
});
