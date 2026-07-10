import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Testes de DocumentPhotoGridList: lista vazia, lista com itens
// e ação de deletar documento.

const { deleteMutate, deleteIsPending } = vi.hoisted(() => ({
	deleteMutate: vi.fn(),
	deleteIsPending: { value: false },
}));

vi.mock("@/features/patients", () => ({
	DOCUMENT_TYPE_LABELS: {
		CPF: "CPF",
		RG: "RG",
		CNH: "CNH",
		HEALTH_CARD: "Cartão de Saúde",
		INSURANCE_CARD: "Carteirinha do Plano",
		OTHER: "Outro",
	},
	useDeleteDocument: () => ({
		mutate: deleteMutate,
		isPending: deleteIsPending.value,
	}),
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { toast } from "sonner";
import { DocumentPhotoGridList } from "./DocumentPhotoGridList";

beforeEach(() => {
	deleteMutate.mockReset();
	deleteIsPending.value = false;
});

const doc = {
	id: "doc-1",
	documentType: "RG" as const,
	documentLabel: "RG frente",
	fileUrl: "https://files.example.com/rg.pdf",
	fileName: "rg.pdf",
	uploadedAt: null,
};

describe("DocumentPhotoGridList", () => {
	it("exibe mensagem quando não há documentos", () => {
		render(<DocumentPhotoGridList documents={[]} />);
		expect(screen.getByText("Nenhum documento enviado.")).toBeInTheDocument();
	});

	it("renderiza o tipo e o label do documento", () => {
		render(<DocumentPhotoGridList documents={[doc]} />);
		expect(screen.getByText("RG")).toBeInTheDocument();
		expect(screen.getByText("RG frente")).toBeInTheDocument();
	});

	it("renderiza o link 'Ver' apontando para o fileUrl", () => {
		render(<DocumentPhotoGridList documents={[doc]} />);
		const link = screen.getByText("Ver").closest("a");
		expect(link).toHaveAttribute("href", doc.fileUrl);
	});

	it("chama deleteDoc.mutate ao clicar no botão de excluir", async () => {
		render(<DocumentPhotoGridList documents={[doc]} />);
		const deleteButton = screen.getAllByRole("button")[1];
		await userEvent.click(deleteButton);
		expect(deleteMutate).toHaveBeenCalledWith("doc-1", expect.any(Object));
	});

	it("mostra toast de sucesso ao remover documento", async () => {
		deleteMutate.mockImplementation((_id, opts) => opts.onSuccess());
		render(<DocumentPhotoGridList documents={[doc]} />);
		const deleteButton = screen.getAllByRole("button")[1];
		await userEvent.click(deleteButton);
		expect(toast.success).toHaveBeenCalledWith("Documento removido.");
	});

	it("mostra toast de erro quando a remoção falha", async () => {
		deleteMutate.mockImplementation((_id, opts) => opts.onError());
		render(<DocumentPhotoGridList documents={[doc]} />);
		const deleteButton = screen.getAllByRole("button")[1];
		await userEvent.click(deleteButton);
		expect(toast.error).toHaveBeenCalledWith("Erro ao remover.");
	});

	it("desabilita o botão de excluir quando a exclusão está pendente", () => {
		deleteIsPending.value = true;
		render(<DocumentPhotoGridList documents={[doc]} />);
		const deleteButton = screen.getAllByRole("button")[1];
		expect(deleteButton).toBeDisabled();
	});
});
