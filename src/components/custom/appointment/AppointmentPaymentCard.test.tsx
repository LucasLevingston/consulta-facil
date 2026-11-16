import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppointmentPaymentCard } from "./AppointmentPaymentCard";

function appointment(overrides: Record<string, unknown> = {}) {
	return {
		id: "a1",
		patientName: "João Silva",
		professionalName: "Dra. Ana",
		scheduledAt: "2026-12-01T14:30:00",
		paymentStatus: "PAID",
		paymentAmount: 250,
		serviceName: "Consulta geral",
		...overrides,
	} as never;
}

describe("AppointmentPaymentCard", () => {
	it("shows patient, date, payment status, amount and service", () => {
		render(
			<AppointmentPaymentCard
				appointment={appointment()}
				showProfessionalName={false}
			/>,
		);

		expect(screen.getByText("João Silva")).toBeInTheDocument();
		expect(screen.getByText("01/12/2026 às 14:30")).toBeInTheDocument();
		expect(screen.getByText("Pago")).toBeInTheDocument();
		expect(screen.getByText(/250,00/)).toBeInTheDocument();
		expect(screen.getByText("Consulta geral")).toBeInTheDocument();
		expect(screen.queryByText("Dra. Ana")).not.toBeInTheDocument();
	});

	it("shows the professional when asked (admin view)", () => {
		render(
			<AppointmentPaymentCard
				appointment={appointment()}
				showProfessionalName
			/>,
		);

		expect(screen.getByText("Dra. Ana")).toBeInTheDocument();
	});

	it("falls back to generic labels", () => {
		render(
			<AppointmentPaymentCard
				appointment={appointment({
					patientName: null,
					paymentStatus: "SOMETHING_NEW",
					serviceName: null,
				})}
				showProfessionalName={false}
			/>,
		);

		expect(screen.getByText("Paciente")).toBeInTheDocument();
		expect(screen.getByText("SOMETHING_NEW")).toBeInTheDocument();
	});

	it.each([0, null])("hides the amount when it is %s", (paymentAmount) => {
		render(
			<AppointmentPaymentCard
				appointment={appointment({ paymentAmount })}
				showProfessionalName={false}
			/>,
		);

		expect(screen.queryByText(/R\$/)).not.toBeInTheDocument();
	});

	it("hides the badge when there is no payment status", () => {
		render(
			<AppointmentPaymentCard
				appointment={appointment({ paymentStatus: null })}
				showProfessionalName={false}
			/>,
		);

		expect(screen.queryByText("Pago")).not.toBeInTheDocument();
	});
});
