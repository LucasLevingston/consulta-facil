import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChartCard } from "./ChartCard";

describe("ChartCard", () => {
	it("renders the title above its content", () => {
		render(
			<ChartCard title="Receita por mês">
				<p>gráfico</p>
			</ChartCard>,
		);

		expect(screen.getByText("Receita por mês")).toBeInTheDocument();
		expect(screen.getByText("gráfico")).toBeInTheDocument();
	});
});
