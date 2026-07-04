import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
	default: ({
		href,
		children,
	}: {
		href: string;
		children: React.ReactNode;
	}) => <a href={href}>{children}</a>,
}));

import { ProfileAppointmentStats } from "@/components/profile/ProfileAppointmentStats";
import type { AppointmentResponse } from "@/features/appointments";

function makeAppointment(
	overrides: Partial<AppointmentResponse>,
): AppointmentResponse {
	return {
		id: "a-1",
		patientId: "p-1",
		professionalId: "pr-1",
		scheduledAt: "2026-08-01T10:00:00.000Z",
		status: "PENDING",
		...overrides,
	} as AppointmentResponse;
}

describe("ProfileAppointmentStats", () => {
	it("renderiza o total de consultas", () => {
		const appointments = [
			makeAppointment({ id: "1", status: "PENDING" }),
			makeAppointment({ id: "2", status: "CONFIRMED" }),
		];
		render(<ProfileAppointmentStats appointments={appointments} />);

		expect(screen.getByText("Total")).toBeInTheDocument();
		expect(screen.getByText("2")).toBeInTheDocument();
	});

	it("conta corretamente consultas pendentes, confirmadas e concluídas", () => {
		const appointments = [
			makeAppointment({ id: "1", status: "PENDING" }),
			makeAppointment({ id: "2", status: "PENDING" }),
			makeAppointment({ id: "3", status: "CONFIRMED" }),
			makeAppointment({ id: "4", status: "COMPLETED" }),
		];
		render(<ProfileAppointmentStats appointments={appointments} />);

		expect(screen.getByText("Pendentes")).toBeInTheDocument();
		expect(screen.getByText("Confirmadas")).toBeInTheDocument();
		expect(screen.getByText("Concluídas")).toBeInTheDocument();
		expect(screen.getAllByText("1")).toHaveLength(2);
	});

	it("renderiza zero quando não há consultas", () => {
		render(<ProfileAppointmentStats appointments={[]} />);
		expect(screen.getAllByText("0")).toHaveLength(4);
	});

	it("renderiza o link para ver todas as consultas", () => {
		render(<ProfileAppointmentStats appointments={[]} />);
		const link = screen.getByText("Ver todas").closest("a");
		expect(link).toHaveAttribute("href", "/dashboard/appointments");
	});
});
