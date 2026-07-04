import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Testes de DocumentUploadDialog: abertura, preenchimento e submit
// chamando a mutation de upload de documento.

const { uploadMutate, uploadIsPending } = vi.hoisted(() => ({
	uploadMutate: vi.fn(),
	uploadIsPending: { value: false },
}));

vi.mock("@/features/patients", () => ({
	useUploadDocument: () => ({
		mutate: uploadMutate,
		isPending: uploadIsPending.value,
	}),
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
	DocumentTypeSelect: ({
		onChange,
	}: {
		value: string;
		onChange: (v: string) => void;
	}) => (
		<button type="button" onClick={() => onChange("CNH")}>
			trocar-tipo
		</button>
	),
}));

import { toast } from "sonner";
import { DocumentUploadDialog } from "@/components/patients/health/DocumentUploadDialog";

const file = new File(["conteudo"], "exame.pdf", { type: "application/pdf" });

beforeEach(() => {
	uploadMutate.mockReset();
	uploadIsPending.value = false;
});

describe("DocumentUploadDialog", () => {
	it("renderiza nada quando open=false", () => {
		const { container } = render(
			<DocumentUploadDialog open={false} onClose={vi.fn()} file={file} />,
		);
		expect(container.firstChild).toBeNull();
	});

	it("renderiza o título e o nome do arquivo", () => {
		render(<DocumentUploadDialog open={true} onClose={vi.fn()} file={file} />);
		expect(screen.getByText("Enviar documento")).toBeInTheDocument();
		expect(screen.getByText("exame.pdf")).toBeInTheDocument();
	});

	it("chama onClose ao clicar em Cancelar", async () => {
		const onClose = vi.fn();
		render(<DocumentUploadDialog open={true} onClose={onClose} file={file} />);
		await userEvent.click(screen.getByText("Cancelar"));
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("permite preencher a descrição do documento", async () => {
		render(<DocumentUploadDialog open={true} onClose={vi.fn()} file={file} />);
		const input = screen.getByPlaceholderText("Ex: Carteirinha Unimed");
		await userEvent.type(input, "Carteirinha do plano");
		expect(input).toHaveValue("Carteirinha do plano");
	});

	it("chama upload.mutate com o arquivo, tipo e descrição ao enviar", async () => {
		render(<DocumentUploadDialog open={true} onClose={vi.fn()} file={file} />);
		await userEvent.click(screen.getByText("trocar-tipo"));
		await userEvent.type(
			screen.getByPlaceholderText("Ex: Carteirinha Unimed"),
			"Documento CNH",
		);
		await userEvent.click(screen.getByText("Enviar"));
		expect(uploadMutate).toHaveBeenCalledWith(
			{ file, documentType: "CNH", documentLabel: "Documento CNH" },
			expect.any(Object),
		);
	});

	it("mostra toast de sucesso e fecha o dialog ao enviar com sucesso", async () => {
		uploadMutate.mockImplementation((_data, opts) => opts.onSuccess());
		const onClose = vi.fn();
		render(<DocumentUploadDialog open={true} onClose={onClose} file={file} />);
		await userEvent.click(screen.getByText("Enviar"));
		expect(toast.success).toHaveBeenCalledWith("Documento enviado!");
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("mostra toast de erro quando o envio falha", async () => {
		uploadMutate.mockImplementation((_data, opts) => opts.onError());
		render(<DocumentUploadDialog open={true} onClose={vi.fn()} file={file} />);
		await userEvent.click(screen.getByText("Enviar"));
		expect(toast.error).toHaveBeenCalledWith("Erro ao enviar documento.");
	});

	it("desabilita o botão Enviar quando isPending=true", () => {
		uploadIsPending.value = true;
		render(<DocumentUploadDialog open={true} onClose={vi.fn()} file={file} />);
		expect(screen.getByText("Enviando...")).toBeDisabled();
	});
});
