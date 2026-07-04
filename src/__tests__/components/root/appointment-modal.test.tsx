import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-datepicker/dist/react-datepicker.css", () => ({}));

const DialogCtx = React.createContext<{
	open: boolean;
	onOpenChange: (open: boolean) => void;
}>({ open: false, onOpenChange: () => {} });

vi.mock("@/components/ui/dialog", () => ({
	Dialog: ({
		children,
		open,
		onOpenChange,
	}: {
		children: React.ReactNode;
		open: boolean;
		onOpenChange: (open: boolean) => void;
	}) => (
		<DialogCtx.Provider value={{ open, onOpenChange }}>
			{children}
		</DialogCtx.Provider>
	),
	DialogTrigger: ({ children }: { children: React.ReactElement }) => {
		const { onOpenChange } = React.useContext(DialogCtx);
		return React.cloneElement(children, {
			onClick: () => onOpenChange(true),
		} as React.HTMLAttributes<HTMLElement>);
	},
	DialogContent: ({
		children,
		className,
	}: {
		children: React.ReactNode;
		className?: string;
	}) => {
		const { open } = React.useContext(DialogCtx);
		return open ? (
			<div data-testid="dialog-content" className={className}>
				{children}
			</div>
		) : null;
	},
	DialogHeader: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	DialogTitle: ({ children }: { children: React.ReactNode }) => (
		<h2>{children}</h2>
	),
	DialogDescription: ({ children }: { children: React.ReactNode }) => (
		<p>{children}</p>
	),
}));
vi.mock("@/components/forms/Appointments/AppointmentForm", () => ({
	AppointmentForm: ({ type }: { type: string }) => (
		<div data-testid="appointment-form">form-{type}</div>
	),
}));
vi.mock("@/components/forms/Appointments/CancelAppointmentForm", () => ({
	CancelAppointmentForm: () => <div data-testid="cancel-form">cancel-form</div>,
}));

import { AppointmentModal } from "@/components/AppointmentModal";
import type { AppointmentResponse } from "@/lib/schemas/appointment/appointment-response.schema";

const appointment = { id: "a-1" } as unknown as AppointmentResponse;

describe("AppointmentModal", () => {
	it("renderiza o botão 'Agendar' quando type é schedule", () => {
		render(
			<AppointmentModal
				type="schedule"
				title="Agendar consulta"
				description="Preencha os dados"
			/>,
		);
		expect(screen.getByText("Agendar")).toBeInTheDocument();
	});

	it("renderiza o botão 'Cancelar' quando type é cancel", () => {
		render(
			<AppointmentModal
				type="cancel"
				appointment={appointment}
				title="Cancelar consulta"
				description="Tem certeza?"
			/>,
		);
		expect(screen.getByText("Cancelar")).toBeInTheDocument();
	});

	it("não mostra o conteúdo do modal antes de abrir", () => {
		render(
			<AppointmentModal
				type="schedule"
				title="Agendar consulta"
				description="Preencha os dados"
			/>,
		);
		expect(screen.queryByTestId("dialog-content")).not.toBeInTheDocument();
	});

	it("abre o modal e mostra título e descrição ao clicar no trigger", () => {
		render(
			<AppointmentModal
				type="schedule"
				title="Agendar consulta"
				description="Preencha os dados"
			/>,
		);
		fireEvent.click(screen.getByText("Agendar"));
		expect(screen.getByTestId("dialog-content")).toBeInTheDocument();
		expect(screen.getByText("Agendar consulta")).toBeInTheDocument();
		expect(screen.getByText("Preencha os dados")).toBeInTheDocument();
	});

	it("renderiza o AppointmentForm quando type é schedule e o modal está aberto", () => {
		render(
			<AppointmentModal
				type="schedule"
				title="Agendar consulta"
				description="Preencha os dados"
			/>,
		);
		fireEvent.click(screen.getByText("Agendar"));
		expect(screen.getByTestId("appointment-form")).toHaveTextContent(
			"form-schedule",
		);
	});

	it("renderiza o CancelAppointmentForm quando type é cancel, appointment fornecido e modal aberto", () => {
		render(
			<AppointmentModal
				type="cancel"
				appointment={appointment}
				title="Cancelar consulta"
				description="Tem certeza?"
			/>,
		);
		fireEvent.click(screen.getByText("Cancelar"));
		expect(screen.getByTestId("cancel-form")).toBeInTheDocument();
	});
});
