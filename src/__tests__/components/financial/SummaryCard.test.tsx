import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SummaryCard } from "@/components/financial/SummaryCard";

describe("SummaryCard", () => {
	it("renderiza label, valor e subtitulo", () => {
		render(
			<SummaryCard
				icon={<span data-testid="icon" />}
				label="Receita total"
				value="R$ 1.000,00"
				sub="5 consultas pagas"
				colorClass="bg-green-500/10 text-green-600"
			/>,
		);

		expect(screen.getByText("Receita total")).toBeInTheDocument();
		expect(screen.getByText("R$ 1.000,00")).toBeInTheDocument();
		expect(screen.getByText("5 consultas pagas")).toBeInTheDocument();
		expect(screen.getByTestId("icon")).toBeInTheDocument();
	});

	it("nao renderiza o subtitulo quando ele nao e informado", () => {
		render(
			<SummaryCard
				icon={<span data-testid="icon" />}
				label="Concluidas"
				value="10"
				colorClass="bg-blue-500/10 text-blue-600"
			/>,
		);

		expect(screen.getByText("Concluidas")).toBeInTheDocument();
		expect(screen.getByText("10")).toBeInTheDocument();
	});
});
