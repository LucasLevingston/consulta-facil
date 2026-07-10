import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/procedure-requests", () => ({
	useScheduleProcedureRequest: vi.fn(() => ({
		mutateAsync: vi.fn(),
		isPending: false,
	})),
	scheduleProcedureRequestSchema: { parse: vi.fn() },
}));
vi.mock("@hookform/resolvers/zod", () => ({
	zodResolver: vi.fn(() => vi.fn()),
}));
vi.mock("./ProcedureModalitySelect", () => ({
	ProcedureModalitySelect: () => <div />,
}));
vi.mock("@/components/ui/button", () => ({
	Button: ({
		children,
		onClick,
		disabled,
	}: {
		children: React.ReactNode;
		onClick?: () => void;
		disabled?: boolean;
	}) => (
		<button type="button" onClick={onClick} disabled={disabled}>
			{children}
		</button>
	),
}));
vi.mock("@/components/ui/dialog", () => ({
	Dialog: ({ children }: { children: React.ReactNode; open: boolean }) => (
		<div>{children}</div>
	),
	DialogTrigger: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	DialogContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	DialogHeader: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	DialogTitle: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}));

import { PatientRequestActions } from "./PatientRequestActions";

const base = {
	requestId: "r-1",
	serviceName: "Consulta Geral",
	canceling: false,
	onCancel: vi.fn(),
};

describe("PatientRequestActions render", () => {
	it("renders null when neither canSchedule nor canCancel", () => {
		const { container } = render(
			<PatientRequestActions {...base} canSchedule={false} canCancel={false} />,
		);
		expect(container.firstChild).toBeNull();
	});

	it("renders Agendar button when canSchedule=true", () => {
		render(
			<PatientRequestActions {...base} canSchedule={true} canCancel={false} />,
		);
		expect(screen.getByText("Agendar")).toBeInTheDocument();
	});

	it("renders Cancelar button when canCancel=true", () => {
		render(
			<PatientRequestActions {...base} canSchedule={false} canCancel={true} />,
		);
		expect(screen.getByText("Cancelar")).toBeInTheDocument();
	});
});
