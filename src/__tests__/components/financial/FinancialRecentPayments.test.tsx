import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FinancialRecentPayments } from "@/components/financial/FinancialRecentPayments";
import type { AppointmentResponse } from "@/features/appointments";

function makeAppointment(
	overrides: Partial<AppointmentResponse>,
): AppointmentResponse {
	return {
		id: "apt-1",
		patientId: "patient-1",
		professionalId: "professional-1",
		patientName: "Joao Silva",
		scheduledAt: "2026-06-01T10:00:00Z",
		status: "COMPLETED",
		paymentStatus: "PAID",
		paymentAmount: 200,
		...overrides,
	} as AppointmentResponse;
}

describe("FinancialRecentPayments", () => {
	it("renderiza as consultas pagas mais recentes", () => {
		const appointments = [
			makeAppointment({ id: "1", patientName: "Joao Silva" }),
			makeAppointment({ id: "2", patientName: "Maria Souza" }),
		];

		render(<FinancialRecentPayments appointments={appointments} />);

		expect(screen.getByText("Últimas consultas pagas")).toBeInTheDocument();
		expect(screen.getByText("Joao Silva")).toBeInTheDocument();
		expect(screen.getByText("Maria Souza")).toBeInTheDocument();
	});

	it("ignora consultas que nao estao pagas", () => {
		const appointments = [
			makeAppointment({
				id: "1",
				patientName: "Pendente",
				paymentStatus: "PENDING_PAYMENT",
			}),
		];

		render(<FinancialRecentPayments appointments={appointments} />);

		expect(screen.queryByText("Pendente")).not.toBeInTheDocument();
	});

	it("exibe mensagem quando nao ha consultas pagas", () => {
		render(<FinancialRecentPayments appointments={[]} />);

		expect(
			screen.getByText("Nenhuma consulta paga encontrada."),
		).toBeInTheDocument();
	});
});
