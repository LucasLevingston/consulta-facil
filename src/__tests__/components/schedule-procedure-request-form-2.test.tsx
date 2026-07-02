import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/procedure-requests", () => ({
	useScheduleProcedureRequest: vi.fn(() => ({
		mutateAsync: vi.fn().mockResolvedValue({}),
		isPending: false,
	})),
	scheduleProcedureRequestSchema: { _def: {} },
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
vi.mock("@/components/procedure-requests/ProcedureModalitySelect", () => ({
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

import { ScheduleProcedureRequestForm } from "@/components/procedure-requests/ScheduleProcedureRequestForm";

describe("ScheduleProcedureRequestForm interaction", () => {
	it("renders Confirmar agendamento button", () => {
		render(
			<ScheduleProcedureRequestForm
				requestId="r-1"
				serviceName="Ultrassom"
				onClose={vi.fn()}
			/>,
		);
		expect(screen.getByText("Confirmar agendamento")).toBeInTheDocument();
	});

	it("calls onClose when Cancelar clicked", async () => {
		const onClose = vi.fn();
		render(
			<ScheduleProcedureRequestForm
				requestId="r-1"
				serviceName="Ultrassom"
				onClose={onClose}
			/>,
		);
		await userEvent.click(screen.getByText("Cancelar"));
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
