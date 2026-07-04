import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Testes do container DocumentPhotoGrid: renderização e fluxo de
// seleção de arquivo que abre o dialog de upload.

const { documents } = vi.hoisted(() => ({
	documents: { value: [] as { id: string }[] },
}));

vi.mock("@/features/patients", () => ({
	usePatientDocuments: () => ({ data: documents.value }),
}));

vi.mock("@/components/patients/health/DocumentPhotoGridList", () => ({
	DocumentPhotoGridList: ({ documents: docs }: { documents: unknown[] }) => (
		<div data-testid="grid-list">{docs.length} documento(s)</div>
	),
}));

vi.mock("@/components/patients/health/DocumentUploadDialog", () => ({
	DocumentUploadDialog: ({
		open,
		file,
		onClose,
	}: {
		open: boolean;
		file: File | null;
		onClose: () => void;
	}) =>
		open ? (
			<div data-testid="upload-dialog">
				<span>{file?.name}</span>
				<button type="button" onClick={onClose}>
					fechar
				</button>
			</div>
		) : null,
}));

import { DocumentPhotoGrid } from "@/components/patients/health/DocumentPhotoGrid";

beforeEach(() => {
	documents.value = [];
});

describe("DocumentPhotoGrid", () => {
	it("renderiza o título 'Documentos'", () => {
		render(<DocumentPhotoGrid />);
		expect(screen.getByText("Documentos")).toBeInTheDocument();
	});

	it("renderiza a descrição do card", () => {
		render(<DocumentPhotoGrid />);
		expect(
			screen.getByText("RG, CPF, CNH, carteirinha do plano e outros."),
		).toBeInTheDocument();
	});

	it("passa os documentos recebidos para DocumentPhotoGridList", () => {
		documents.value = [{ id: "d1" }, { id: "d2" }];
		render(<DocumentPhotoGrid />);
		expect(screen.getByTestId("grid-list")).toHaveTextContent("2 documento(s)");
	});

	it("não exibe o dialog de upload inicialmente", () => {
		render(<DocumentPhotoGrid />);
		expect(screen.queryByTestId("upload-dialog")).not.toBeInTheDocument();
	});

	it("abre o dialog de upload ao selecionar um arquivo", async () => {
		const { container } = render(<DocumentPhotoGrid />);
		const input = container.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;
		const file = new File(["conteudo"], "exame.pdf", {
			type: "application/pdf",
		});
		await userEvent.upload(input, file);
		expect(screen.getByTestId("upload-dialog")).toBeInTheDocument();
		expect(screen.getByText("exame.pdf")).toBeInTheDocument();
	});

	it("fecha o dialog e limpa o arquivo selecionado ao chamar onClose", async () => {
		const { container } = render(<DocumentPhotoGrid />);
		const input = container.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;
		const file = new File(["conteudo"], "exame.pdf", {
			type: "application/pdf",
		});
		await userEvent.upload(input, file);
		await userEvent.click(screen.getByText("fechar"));
		expect(screen.queryByTestId("upload-dialog")).not.toBeInTheDocument();
	});
});
