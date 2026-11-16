import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { AppointmentResponse } from "@/features/appointments";

vi.mock("@/components/custom/fees/use-fee-config", () => ({
	useFeeConfig: () => ({ data: undefined }),
}));

import { FinancialContent } from "./FinancialContent";

function makeAppointment(
	overrides: Partial<AppointmentResponse>,
): AppointmentResponse {
	return {
		id: "apt-1",
		patientId: "patient-1",
		professionalId: "professional-1",
		patientName: "Joao Silva",
		scheduledAt: new Date().toISOString(),
		status: "COMPLETED",
		paymentStatus: "PAID",
		paymentAmount: 200,
		...overrides,
	} as AppointmentResponse;
}

describe("FinancialContent", () => {
	it("renderiza o resumo financeiro, o grafico mensal e os pagamentos recentes", () => {
		const appointments = [makeAppointment({})];

		render(<FinancialContent appointments={appointments} />);

		expect(screen.getByText("Receita total")).toBeInTheDocument();
		expect(
			screen.getByText("Receita mensal — últimos 6 meses"),
		).toBeInTheDocument();
		expect(screen.getByText("Últimas consultas pagas")).toBeInTheDocument();
	});

	it("renderiza corretamente com uma lista vazia de consultas", () => {
		render(<FinancialContent appointments={[]} />);

		expect(screen.getByText("Receita total")).toBeInTheDocument();
		expect(
			screen.getByText("Nenhum pagamento registrado ainda."),
		).toBeInTheDocument();
		expect(
			screen.getByText("Nenhuma consulta paga encontrada."),
		).toBeInTheDocument();
	});
});
