import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProfileNextAppointment } from "@/components/profile/ProfileNextAppointment";
import type { AppointmentResponse } from "@/features/appointments";

// Observação: a página de perfil (ProfilePage) só renderiza este componente
// quando existe uma próxima consulta agendada (renderização condicional no
// componente pai). O componente em si sempre recebe um `appointment`
// obrigatório, então o estado "sem próxima consulta" é tratado fora deste
// componente. Aqui cobrimos os cenários "com próxima consulta agendada"
// para paciente e para profissional, e as variações de status.

function makeAppointment(
	overrides: Partial<AppointmentResponse>,
): AppointmentResponse {
	return {
		id: "a-1",
		patientId: "p-1",
		professionalId: "pr-1",
		patientName: "João Souza",
		professionalName: "Dra. Ana Lima",
		scheduledAt: "2026-08-10T14:30:00.000Z",
		status: "CONFIRMED",
		...overrides,
	} as AppointmentResponse;
}

describe("ProfileNextAppointment", () => {
	it("exibe o nome do paciente quando isProfessional é verdadeiro", () => {
		render(
			<ProfileNextAppointment
				appointment={makeAppointment({})}
				isProfessional={true}
			/>,
		);
		expect(screen.getByText("Paciente: João Souza")).toBeInTheDocument();
	});

	it("exibe o nome do profissional quando isProfessional é falso", () => {
		render(
			<ProfileNextAppointment
				appointment={makeAppointment({})}
				isProfessional={false}
			/>,
		);
		expect(screen.getByText("Dra. Ana Lima")).toBeInTheDocument();
	});

	it("exibe o badge 'Confirmada' quando status é CONFIRMED", () => {
		render(
			<ProfileNextAppointment
				appointment={makeAppointment({ status: "CONFIRMED" })}
				isProfessional={false}
			/>,
		);
		expect(screen.getByText("Confirmada")).toBeInTheDocument();
	});

	it("exibe o badge 'Pendente' quando status não é CONFIRMED", () => {
		render(
			<ProfileNextAppointment
				appointment={makeAppointment({ status: "PENDING" })}
				isProfessional={false}
			/>,
		);
		expect(screen.getByText("Pendente")).toBeInTheDocument();
	});

	it("exibe o texto 'Próxima consulta'", () => {
		render(
			<ProfileNextAppointment
				appointment={makeAppointment({})}
				isProfessional={false}
			/>,
		);
		expect(screen.getByText("Próxima consulta")).toBeInTheDocument();
	});
});
