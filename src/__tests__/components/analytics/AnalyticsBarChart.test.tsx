import { render } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { AnalyticsBarChart } from "@/components/analytics/charts/AnalyticsBarChart";
import type { Breakdown } from "@/features/analytics";

// jsdom não implementa ResizeObserver, mas o recharts (ResponsiveContainer)
// depende dele para medir o container do grafico.
beforeAll(() => {
	global.ResizeObserver = class {
		observe = vi.fn();
		unobserve = vi.fn();
		disconnect = vi.fn();
	} as unknown as typeof ResizeObserver;
});

describe("AnalyticsBarChart", () => {
	const data: Breakdown[] = [
		{ label: "Jan", count: 10, percentage: 40 },
		{ label: "Fev", count: 15, percentage: 60 },
	];

	it("renderiza o grafico de barras sem quebrar quando ha dados", () => {
		const { container } = render(<AnalyticsBarChart data={data} />);

		expect(
			container.querySelector(".recharts-responsive-container"),
		).toBeTruthy();
	});

	it("renderiza sem quebrar quando a lista de dados esta vazia", () => {
		const { container } = render(<AnalyticsBarChart data={[]} />);

		expect(
			container.querySelector(".recharts-responsive-container"),
		).toBeTruthy();
	});
});
