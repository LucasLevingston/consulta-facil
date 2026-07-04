import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FinancialSummaryGrid } from "@/components/financial/FinancialSummaryGrid";
import type { AppointmentResponse } from "@/features/appointments";

function makeAppointment(
	overrides: Partial<AppointmentResponse>,
): AppointmentResponse {
	return {
		id: "apt-1",
		patientId: "patient-1",
		professionalId: "professional-1",
		scheduledAt: "2026-06-01T10:00:00Z",
		status: "COMPLETED",
		paymentStatus: "PAID",
		paymentAmount: 200,
		...overrides,
	} as AppointmentResponse;
}

describe("FinancialSummaryGrid", () => {
	it("renderiza os totais calculados a partir das consultas pagas e pendentes", () => {
		const appointments = [
			makeAppointment({ id: "1", paymentStatus: "PAID", paymentAmount: 200 }),
			makeAppointment({ id: "2", paymentStatus: "PAID", paymentAmount: 300 }),
			makeAppointment({
				id: "3",
				paymentStatus: "PENDING_PAYMENT",
				paymentAmount: 150,
			}),
			makeAppointment({ id: "4", status: "COMPLETED" }),
		];

		render(<FinancialSummaryGrid appointments={appointments} />);

		expect(screen.getByText("Receita total")).toBeInTheDocument();
		expect(screen.getByText("Ticket médio")).toBeInTheDocument();
		expect(screen.getByText("Pendente")).toBeInTheDocument();
		expect(screen.getByText("Concluídas")).toBeInTheDocument();
	});

	it("renderiza zeros quando a lista de consultas esta vazia", () => {
		render(<FinancialSummaryGrid appointments={[]} />);

		expect(screen.getByText("0 aguardando pagamento")).toBeInTheDocument();
		expect(screen.getByText("0 consultas pagas")).toBeInTheDocument();
	});
});
