import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProfileStatsBanner } from "@/components/profile/ProfileStatsBanner";
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

describe("ProfileStatsBanner", () => {
	it("renderiza os rótulos Consultas, Confirmadas e Concluídas", () => {
		render(<ProfileStatsBanner appointments={[]} />);

		expect(screen.getByText("Consultas")).toBeInTheDocument();
		expect(screen.getByText("Confirmadas")).toBeInTheDocument();
		expect(screen.getByText("Concluídas")).toBeInTheDocument();
	});

	it("conta corretamente o total, confirmadas e concluídas", () => {
		const appointments = [
			makeAppointment({ id: "1", status: "PENDING" }),
			makeAppointment({ id: "2", status: "CONFIRMED" }),
			makeAppointment({ id: "3", status: "COMPLETED" }),
			makeAppointment({ id: "4", status: "COMPLETED" }),
		];
		render(<ProfileStatsBanner appointments={appointments} />);

		expect(screen.getByText("4")).toBeInTheDocument();
		expect(screen.getAllByText("1")).toHaveLength(1);
		expect(screen.getAllByText("2")).toHaveLength(1);
	});

	it("renderiza zero para todas as métricas quando não há consultas", () => {
		render(<ProfileStatsBanner appointments={[]} />);
		expect(screen.getAllByText("0")).toHaveLength(3);
	});
});
