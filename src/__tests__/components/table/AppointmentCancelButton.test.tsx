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
vi.mock("@/components/forms/Appointments/CancelAppointmentForm", () => ({
	CancelAppointmentForm: () => <div>mock-cancel-form</div>,
}));

import { AppointmentCancelButton } from "@/components/table/AppointmentCancelButton";

const appointment = {
	id: "a-1",
	patientId: "p-1",
	professionalId: "prof-1",
	status: "PENDING",
} as never;

describe("AppointmentCancelButton", () => {
	it("renderiza o botão Cancelar", () => {
		render(<AppointmentCancelButton appointment={appointment} />);
		expect(screen.getByText("Cancelar")).toBeInTheDocument();
	});

	it("não exibe o diálogo de cancelamento inicialmente", () => {
		render(<AppointmentCancelButton appointment={appointment} />);
		expect(screen.queryByText("Cancelar Consulta")).not.toBeInTheDocument();
	});

	it("abre o diálogo de cancelamento ao clicar no botão", async () => {
		render(<AppointmentCancelButton appointment={appointment} />);
		await userEvent.click(screen.getByText("Cancelar"));
		expect(screen.getByText("Cancelar Consulta")).toBeVisible();
		expect(screen.getByText("mock-cancel-form")).toBeInTheDocument();
	});
});
