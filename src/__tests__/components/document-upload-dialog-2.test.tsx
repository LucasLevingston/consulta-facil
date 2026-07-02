import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

describe("DocumentUploadDialog interaction", () => {
	it("renders Cancelar and Enviar buttons", () => {
		render(<DocumentUploadDialog open={true} onClose={vi.fn()} file={file} />);
		expect(screen.getByText("Cancelar")).toBeInTheDocument();
		expect(screen.getByText("Enviar")).toBeInTheDocument();
	});

	it("calls onClose when Cancelar clicked", async () => {
		const onClose = vi.fn();
		render(<DocumentUploadDialog open={true} onClose={onClose} file={file} />);
		await userEvent.click(screen.getByText("Cancelar"));
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("renders nothing when open=false", () => {
		const { container } = render(
			<DocumentUploadDialog open={false} onClose={vi.fn()} file={file} />,
		);
		expect(container.firstChild).toBeNull();
	});
});
