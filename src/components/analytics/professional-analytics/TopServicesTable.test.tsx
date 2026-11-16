import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TopServicesTable } from "./TopServicesTable";

describe("TopServicesTable", () => {
	it("lists services with booking count and formatted revenue", () => {
		render(
			<TopServicesTable
				services={[
					{ id: "svc-1", name: "Consulta geral", count: 12, revenue: 2400 },
					{ id: "svc-2", name: null, count: 1, revenue: 0 },
				]}
			/>,
		);

		const rows = screen.getAllByRole("row");
		expect(rows).toHaveLength(3);
		const first = within(rows[1]);
		expect(first.getByText("Consulta geral")).toBeInTheDocument();
		expect(first.getByText("12")).toBeInTheDocument();
		expect(first.getByText(/2\.400,00/)).toBeInTheDocument();
		expect(within(rows[2]).getByText("Sem nome")).toBeInTheDocument();
	});

	it("shows an empty state when nothing was booked", () => {
		render(<TopServicesTable services={[]} />);

		expect(screen.queryByRole("table")).not.toBeInTheDocument();
		expect(
			screen.getByText("Nenhum serviço agendado no período."),
		).toBeInTheDocument();
	});
});
