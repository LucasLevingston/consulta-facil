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

import { AppointmentsList } from "@/components/custom/dashboard/appointments-list";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";

const appt: AppointmentResponse = {
	id: "a-1",
	status: "PENDING",
	scheduledAt: "2026-06-15T10:00:00Z",
	patientId: "p-1",
	patientName: "João Silva",
	professionalId: "prof-1",
	professionalName: "Dra. Ana",
	specialty: "Cardiologia",
	reason: null,
	modality: "IN_PERSON",
} as unknown as AppointmentResponse;

describe("AppointmentsList", () => {
	it("renders list title for doctor", () => {
		render(<AppointmentsList appointments={[]} isProfessional={true} />);
		expect(screen.getByText("Próximas consultas")).toBeInTheDocument();
	});

	it("renders list title for patient", () => {
		render(<AppointmentsList appointments={[]} isProfessional={false} />);
		expect(screen.getByText("Consultas recentes")).toBeInTheDocument();
	});

	it("shows empty state for doctor", () => {
		render(<AppointmentsList appointments={[]} isProfessional={true} />);
		expect(screen.getByText("Nenhuma consulta agendada.")).toBeInTheDocument();
	});

	it("shows empty state for patient", () => {
		render(<AppointmentsList appointments={[]} isProfessional={false} />);
		expect(
			screen.getByText("Nenhuma consulta encontrada."),
		).toBeInTheDocument();
	});

	it("shows 'Agendar agora' link for patient empty state", () => {
		render(<AppointmentsList appointments={[]} isProfessional={false} />);
		expect(screen.getByText("Agendar agora")).toBeInTheDocument();
	});

	it("does not show 'Agendar agora' for doctor empty state", () => {
		render(<AppointmentsList appointments={[]} isProfessional={true} />);
		expect(screen.queryByText("Agendar agora")).not.toBeInTheDocument();
	});

	it("renders appointment items when provided", () => {
		render(<AppointmentsList appointments={[appt]} isProfessional={false} />);
		expect(screen.getByText("Dra. Ana")).toBeInTheDocument();
	});

	it("renders Ver todas link", () => {
		render(<AppointmentsList appointments={[]} isProfessional={true} />);
		const link = screen.getByRole("link", { name: /Ver todas/ });
		expect(link).toHaveAttribute("href", "/dashboard/appointments");
	});
});
