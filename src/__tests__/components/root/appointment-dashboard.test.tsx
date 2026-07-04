import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
	useRouter: vi.fn(() => ({ push: mockPush })),
	usePathname: vi.fn(() => "/dashboard/appointments"),
	useSearchParams: vi.fn(() => new URLSearchParams()),
}));
vi.mock("@/components/table/columns", () => ({
	makeColumns: vi.fn(() => []),
}));
vi.mock("@/components/table/DataTable", () => ({
	DataTable: ({ data }: { data: unknown[] }) => (
		<div data-testid="data-table">{data.length} rows</div>
	),
}));
vi.mock("@/components/custom/custom-pagination", () => ({
	CustomPagination: () => <div data-testid="pagination" />,
}));

import AppointmentsDashboard from "@/components/AppointmentDashboard";
import { AppointmentDashboardFilters } from "@/components/AppointmentDashboardFilters";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";

describe("AppointmentsDashboard (integração com filtros)", () => {
	it("renderiza os cards de status e a tabela vazia", () => {
		render(<AppointmentsDashboard appointments={[]} />);
		expect(screen.getByText("Todas")).toBeInTheDocument();
		expect(screen.getByTestId("data-table")).toHaveTextContent("0 rows");
	});

	it("navega atualizando a query 'q' ao digitar no input de filtro", () => {
		const appointments = [
			{
				id: "a-1",
				status: "PENDING",
				patientName: "João",
				professionalName: "Dra. Ana",
				specialty: "Cardiologia",
				reason: "Dor no peito",
			},
		] as unknown as AppointmentResponse[];
		render(<AppointmentsDashboard appointments={appointments} />);
		const input = screen.getByPlaceholderText(/Buscar por paciente/);
		fireEvent.change(input, { target: { value: "João" } });
		expect(mockPush).toHaveBeenCalledWith(
			"/dashboard/appointments?q=Jo%C3%A3o",
			{ scroll: false },
		);
	});
});

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
		fireEvent.click(screen.getByText("Confirmadas").closest("button")!);
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
		fireEvent.click(screen.getByText("Todas").closest("button")!);
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
