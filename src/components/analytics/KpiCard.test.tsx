import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KpiCard } from "./KpiCard";

describe("KpiCard", () => {
	it("renders label", () => {
		render(
			<KpiCard kpi={{ label: "Receita Total", value: 1000, unit: "BRL" }} />,
		);
		expect(screen.getByText("Receita Total")).toBeInTheDocument();
	});

	it("BRL unit → formats as currency", () => {
		render(<KpiCard kpi={{ label: "Receita", value: 500, unit: "BRL" }} />);
		expect(screen.getByText(/R\$/)).toBeInTheDocument();
	});

	it("% unit → formats as percentage", () => {
		render(<KpiCard kpi={{ label: "Taxa", value: 12.5, unit: "%" }} />);
		expect(screen.getByText("12.5%")).toBeInTheDocument();
	});

	it("count unit → formats as locale number", () => {
		render(<KpiCard kpi={{ label: "Consultas", value: 42, unit: "count" }} />);
		expect(screen.getByText("42")).toBeInTheDocument();
	});
});
