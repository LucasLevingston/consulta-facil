import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/patients", () => ({
	useUploadDocument: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
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
}));
vi.mock("@/components/ui/input", () => ({
	Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
		<input {...props} />
	),
}));
vi.mock("@/components/ui/label", () => ({
	Label: ({ children }: { children: React.ReactNode }) => (
		<span>{children}</span>
	),
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
vi.mock("@/components/patients/health/DocumentTypeSelect", () => ({
	DocumentTypeSelect: () => <div>doc-type-select</div>,
}));

import { DocumentUploadDialog } from "@/components/patients/health/DocumentUploadDialog";

const file = new File(["content"], "exame.pdf", { type: "application/pdf" });

describe("DocumentUploadDialog render", () => {
	it("renders dialog title", () => {
		render(<DocumentUploadDialog open={true} onClose={vi.fn()} file={file} />);
		expect(screen.getByText("Enviar documento")).toBeInTheDocument();
	});

	it("renders file name", () => {
		render(<DocumentUploadDialog open={true} onClose={vi.fn()} file={file} />);
		expect(screen.getByText("exame.pdf")).toBeInTheDocument();
	});

	it("renders Tipo de documento label", () => {
		render(<DocumentUploadDialog open={true} onClose={vi.fn()} file={file} />);
		expect(screen.getByText("Tipo de documento")).toBeInTheDocument();
	});

	it("renders Descrição label", () => {
		render(<DocumentUploadDialog open={true} onClose={vi.fn()} file={file} />);
		expect(screen.getByText("Descrição (opcional)")).toBeInTheDocument();
	});
});
