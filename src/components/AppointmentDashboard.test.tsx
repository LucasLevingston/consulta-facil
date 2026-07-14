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

import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";
import AppointmentsDashboard from "./AppointmentDashboard";

const makeAppt = (overrides = {}): AppointmentResponse =>
	({
		id: `a-${Math.random()}`,
		status: "PENDING",
		scheduledAt: "2026-06-15T10:00:00Z",
		patientId: "p-1",
		patientName: "João",
		professionalId: "prof-1",
		professionalName: "Dra. Ana",
		specialty: "Cardiologia",
		reason: "Dor no peito",
		modality: "IN_PERSON",
		...overrides,
	}) as unknown as AppointmentResponse;

describe("AppointmentsDashboard", () => {
	it("renders stat cards", () => {
		render(<AppointmentsDashboard appointments={[]} />);
		expect(screen.getByText("Todas")).toBeInTheDocument();
		expect(screen.getByText("Confirmadas")).toBeInTheDocument();
		expect(screen.getByText("Pendentes")).toBeInTheDocument();
		expect(screen.getByText("Canceladas")).toBeInTheDocument();
		expect(screen.getByText("Concluídas")).toBeInTheDocument();
	});

	it("renders search input", () => {
		render(<AppointmentsDashboard appointments={[]} />);
		expect(
			screen.getByPlaceholderText(/Buscar por paciente/),
		).toBeInTheDocument();
	});

	it("renders data table", () => {
		render(<AppointmentsDashboard appointments={[]} />);
		expect(screen.getByTestId("data-table")).toBeInTheDocument();
	});

	it("renders pagination", () => {
		render(<AppointmentsDashboard appointments={[]} />);
		expect(screen.getByTestId("pagination")).toBeInTheDocument();
	});

	it("shows total count in stat card", () => {
		const appointments = [
			makeAppt({ status: "CONFIRMED" }),
			makeAppt({ status: "PENDING" }),
			makeAppt({ status: "CANCELED" }),
		];
		render(<AppointmentsDashboard appointments={appointments} />);
		expect(screen.getByText("3")).toBeInTheDocument();
	});

	it("renders all rows in table", () => {
		const appointments = [makeAppt(), makeAppt(), makeAppt()];
		render(<AppointmentsDashboard appointments={appointments} />);
		expect(screen.getByText("3 rows")).toBeInTheDocument();
	});

	it("filters by search param from URL", async () => {
		const nav = await import("next/navigation");
		vi.mocked(nav.useSearchParams).mockReturnValue(
			new URLSearchParams("q=Carlos") as never,
		);

		const appointments = [
			makeAppt({ patientName: "Carlos" }),
			makeAppt({ patientName: "Maria" }),
		];
		render(<AppointmentsDashboard appointments={appointments} />);
		expect(screen.getByText("1 rows")).toBeInTheDocument();
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
