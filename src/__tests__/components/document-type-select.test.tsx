import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/patients", () => ({
	DOCUMENT_TYPE_LABELS: {
		EXAM: "Exame",
		PRESCRIPTION: "Receita",
		OTHER: "Outro",
	},
	documentTypeSchema: { parse: (v: string) => v },
}));
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
	SelectValue: () => null,
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

import { DocumentTypeSelect } from "@/components/patients/health/DocumentTypeSelect";

describe("DocumentTypeSelect", () => {
	it("renders all document type options", () => {
		render(<DocumentTypeSelect value={"OTHER" as never} onChange={vi.fn()} />);
		expect(screen.getByText("Exame")).toBeInTheDocument();
		expect(screen.getByText("Receita")).toBeInTheDocument();
		expect(screen.getByText("Outro")).toBeInTheDocument();
	});

	it("passes value to Select", () => {
		render(<DocumentTypeSelect value={"EXAM" as never} onChange={vi.fn()} />);
		expect(screen.getByTestId("select")).toHaveAttribute("data-value", "EXAM");
	});
});
