import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/ui/dialog", () => ({
	Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
		open ? <div>{children}</div> : null,
	DialogContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	DialogHeader: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	DialogTitle: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	DialogDescription: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}));
vi.mock("@/components/forms/Appointments/RateAppointmentForm", () => ({
	RateAppointmentForm: () => <div>mock-rate-form</div>,
}));

import { AppointmentRateButton } from "@/components/table/AppointmentRateButton";

const appointment = {
	id: "a-1",
	patientId: "p-1",
	professionalId: "prof-1",
	status: "COMPLETED",
} as never;

describe("AppointmentRateButton", () => {
	it("renderiza o botão Avaliar", () => {
		render(<AppointmentRateButton appointment={appointment} />);
		expect(screen.getByText("Avaliar")).toBeInTheDocument();
	});

	it("não exibe o diálogo de avaliação inicialmente", () => {
		render(<AppointmentRateButton appointment={appointment} />);
		expect(screen.queryByText("Avaliar consulta")).not.toBeInTheDocument();
	});

	it("abre o diálogo de avaliação ao clicar no botão", async () => {
		render(<AppointmentRateButton appointment={appointment} />);
		await userEvent.click(screen.getByText("Avaliar"));
		expect(screen.getByText("Avaliar consulta")).toBeVisible();
		expect(screen.getByText("mock-rate-form")).toBeInTheDocument();
	});
});
