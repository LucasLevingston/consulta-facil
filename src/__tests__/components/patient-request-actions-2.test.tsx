import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
vi.mock("@/components/procedure-requests/ProcedureModalitySelect", () => ({
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

import { PatientRequestActions } from "@/components/procedure-requests/PatientRequestActions";

const base = {
	requestId: "r-1",
	serviceName: "Consulta Geral",
	canceling: false,
	onCancel: vi.fn(),
};

describe("PatientRequestActions interaction", () => {
	it("disables Cancelar when canceling=true", () => {
		render(
			<PatientRequestActions
				{...base}
				canSchedule={false}
				canCancel={true}
				canceling={true}
			/>,
		);
		expect(screen.getByText("Cancelar")).toBeDisabled();
	});

	it("calls onCancel when Cancelar clicked", async () => {
		const onCancel = vi.fn();
		render(
			<PatientRequestActions
				{...base}
				canSchedule={false}
				canCancel={true}
				onCancel={onCancel}
			/>,
		);
		await userEvent.click(screen.getByText("Cancelar"));
		expect(onCancel).toHaveBeenCalledTimes(1);
	});
});
