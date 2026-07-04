import { render } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { AnalyticsDonutChart } from "@/components/analytics/charts/AnalyticsDonutChart";
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

describe("AnalyticsDonutChart", () => {
	const data: Breakdown[] = [
		{ label: "Pendente", count: 5, percentage: 25 },
		{ label: "Concluido", count: 15, percentage: 75 },
	];

	it("renderiza o grafico de rosca sem quebrar quando ha dados", () => {
		const { container } = render(<AnalyticsDonutChart data={data} />);

		expect(
			container.querySelector(".recharts-responsive-container"),
		).toBeTruthy();
	});

	it("renderiza sem quebrar quando a lista de dados esta vazia", () => {
		const { container } = render(<AnalyticsDonutChart data={[]} />);

		expect(
			container.querySelector(".recharts-responsive-container"),
		).toBeTruthy();
	});
});
