import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AppointmentDashboardFilters } from "./AppointmentDashboardFilters";

describe("AppointmentDashboardFilters", () => {
	const counts = {
		total: 5,
		confirmed: 2,
		pending: 1,
		canceled: 1,
		completed: 1,
	};

	it("renderiza a contagem de cada status", () => {
		render(
			<AppointmentDashboardFilters
				counts={counts}
				activeStatus={null}
				search=""
				onStatusChange={vi.fn()}
				onSearchChange={vi.fn()}
			/>,
		);
		expect(screen.getByText("5")).toBeInTheDocument();
		expect(screen.getByText("Confirmadas")).toBeInTheDocument();
		expect(screen.getByText("Pendentes")).toBeInTheDocument();
	});

	it("chama onStatusChange com o status correspondente ao clicar em um card", () => {
		const onStatusChange = vi.fn();
		render(
			<AppointmentDashboardFilters
				counts={counts}
				activeStatus={null}
				search=""
				onStatusChange={onStatusChange}
				onSearchChange={vi.fn()}
			/>,
		);
		const card = screen.getByText("Confirmadas").closest("button");
		expect(card).not.toBeNull();
		fireEvent.click(card as HTMLButtonElement);
		expect(onStatusChange).toHaveBeenCalledWith("CONFIRMED");
	});

	it("chama onStatusChange com null ao clicar no card 'Todas'", () => {
		const onStatusChange = vi.fn();
		render(
			<AppointmentDashboardFilters
				counts={counts}
				activeStatus="CONFIRMED"
				search=""
				onStatusChange={onStatusChange}
				onSearchChange={vi.fn()}
			/>,
		);
		const card = screen.getByText("Todas").closest("button");
		expect(card).not.toBeNull();
		fireEvent.click(card as HTMLButtonElement);
		expect(onStatusChange).toHaveBeenCalledWith(null);
	});

	it("chama onSearchChange ao digitar no campo de busca", () => {
		const onSearchChange = vi.fn();
		render(
			<AppointmentDashboardFilters
				counts={counts}
				activeStatus={null}
				search=""
				onStatusChange={vi.fn()}
				onSearchChange={onSearchChange}
			/>,
		);
		const input = screen.getByPlaceholderText(/Buscar por paciente/);
		fireEvent.change(input, { target: { value: "Maria" } });
		expect(onSearchChange).toHaveBeenCalledWith("Maria");
	});
});
