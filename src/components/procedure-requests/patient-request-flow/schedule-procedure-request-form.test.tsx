import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/procedure-requests", () => ({
	scheduleProcedureRequestSchema: { _def: {} },
}));
vi.mock("./use-schedule-procedure-request", () => ({
	useScheduleProcedureRequest: vi.fn(() => ({
		mutateAsync: vi.fn().mockResolvedValue({}),
		isPending: false,
	})),
}));
vi.mock("@hookform/resolvers/zod", () => ({
	zodResolver: vi.fn(() => async () => ({ errors: {}, values: {} })),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
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
vi.mock("@/components/ui/input", () => ({
	Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
		<input {...props} />
	),
}));
vi.mock("@/components/ui/label", () => ({
	Label: ({
		children,
		htmlFor,
	}: {
		children: React.ReactNode;
		htmlFor?: string;
	}) => <span data-for={htmlFor}>{children}</span>,
}));
vi.mock("./ProcedureModalitySelect", () => ({
	ProcedureModalitySelect: ({
		onChange,
	}: {
		onChange: (v: string) => void;
	}) => (
		<button type="button" onClick={() => onChange("PRESENCIAL")}>
			modality-select
		</button>
	),
}));

import { ScheduleProcedureRequestForm } from "./ScheduleProcedureRequestForm";

describe("ScheduleProcedureRequestForm render", () => {
	it("renders service name", () => {
		render(
			<ScheduleProcedureRequestForm
				requestId="r-1"
				serviceName="Ultrassom"
				onClose={vi.fn()}
			/>,
		);
		expect(screen.getByText("Ultrassom")).toBeInTheDocument();
	});

	it("renders Data e hora label", () => {
		render(
			<ScheduleProcedureRequestForm
				requestId="r-1"
				serviceName="Ultrassom"
				onClose={vi.fn()}
			/>,
		);
		expect(screen.getByText(/Data e hora/)).toBeInTheDocument();
	});

	it("renders Modalidade label", () => {
		render(
			<ScheduleProcedureRequestForm
				requestId="r-1"
				serviceName="Ultrassom"
				onClose={vi.fn()}
			/>,
		);
		expect(screen.getByText("Modalidade")).toBeInTheDocument();
	});
});
