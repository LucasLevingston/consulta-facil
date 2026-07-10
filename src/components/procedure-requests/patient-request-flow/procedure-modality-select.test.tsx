import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/ui/select", () => ({
	Select: ({
		children,
		value,
	}: {
		children: React.ReactNode;
		value?: string;
	}) => (
		<div data-testid="select" data-value={value}>
			{children}
		</div>
	),
	SelectTrigger: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SelectValue: ({ placeholder }: { placeholder?: string }) => (
		<span>{placeholder}</span>
	),
	SelectContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SelectItem: ({
		children,
		value,
	}: {
		children: React.ReactNode;
		value: string;
	}) => <div data-value={value}>{children}</div>,
}));

import { ProcedureModalitySelect } from "./ProcedureModalitySelect";

describe("ProcedureModalitySelect", () => {
	it("renders Presencial option", () => {
		render(<ProcedureModalitySelect onChange={vi.fn()} />);
		expect(screen.getByText("Presencial")).toBeInTheDocument();
	});

	it("renders Online option", () => {
		render(<ProcedureModalitySelect onChange={vi.fn()} />);
		expect(screen.getByText("Online")).toBeInTheDocument();
	});

	it("renders placeholder text", () => {
		render(<ProcedureModalitySelect onChange={vi.fn()} />);
		expect(screen.getByText("Selecione (opcional)")).toBeInTheDocument();
	});

	it("passes value to Select", () => {
		render(<ProcedureModalitySelect value="IN_PERSON" onChange={vi.fn()} />);
		expect(screen.getByTestId("select")).toHaveAttribute(
			"data-value",
			"IN_PERSON",
		);
	});
});
