import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FinancialMonthlyChart } from "@/components/financial/FinancialMonthlyChart";
import type { AppointmentResponse } from "@/features/appointments";

function makeAppointment(
	overrides: Partial<AppointmentResponse>,
): AppointmentResponse {
	return {
		id: "apt-1",
		patientId: "patient-1",
		professionalId: "professional-1",
		scheduledAt: new Date().toISOString(),
		status: "COMPLETED",
		paymentStatus: "PAID",
		paymentAmount: 200,
		...overrides,
	} as AppointmentResponse;
}

describe("FinancialMonthlyChart", () => {
	it("renderiza o titulo do grafico", () => {
		render(<FinancialMonthlyChart appointments={[]} />);

		expect(
			screen.getByText("Receita mensal — últimos 6 meses"),
		).toBeInTheDocument();
	});

	it("exibe mensagem de vazio quando nao ha pagamentos registrados", () => {
		render(<FinancialMonthlyChart appointments={[]} />);

		expect(
			screen.getByText("Nenhum pagamento registrado ainda."),
		).toBeInTheDocument();
	});

	it("renderiza as barras mensais quando ha consultas pagas", () => {
		const appointments = [
			makeAppointment({ id: "1", paymentAmount: 500 }),
			makeAppointment({ id: "2", paymentAmount: 300 }),
		];

		render(<FinancialMonthlyChart appointments={appointments} />);

		expect(
			screen.queryByText("Nenhum pagamento registrado ainda."),
		).not.toBeInTheDocument();
	});
});
