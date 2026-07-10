import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@hookform/resolvers/zod", () => ({
	zodResolver: vi.fn(() => vi.fn()),
}));
vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/features/professionals", () => ({
	professionalCertificateSchema: {},
}));
vi.mock("./use-add-certificate", () => ({
	useAddCertificate: vi.fn(),
}));
vi.mock("./use-update-certificate", () => ({
	useUpdateCertificate: vi.fn(),
}));
vi.mock("./use-delete-certificate", () => ({
	useDeleteCertificate: vi.fn(),
}));
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
vi.mock("./CertificateDialogForm", () => ({
	CertificateDialogForm: ({
		onSubmit,
		onClose,
		isPending,
	}: {
		onSubmit: (data: object) => void;
		onClose: () => void;
		isPending: boolean;
	}) => (
		<div>
			<span>form-pending:{String(isPending)}</span>
			<button type="button" onClick={() => onSubmit({ title: "Curso X" })}>
				submit-form
			</button>
			<button type="button" onClick={onClose}>
				close-form
			</button>
		</div>
	),
}));

import { CertificateDialog } from "./CertificateDialog";
import { CertificateList } from "./CertificateList";
import { CertificateListItem } from "./CertificateListItem";
import { useAddCertificate } from "./use-add-certificate";
import { useDeleteCertificate } from "./use-delete-certificate";
import { useUpdateCertificate } from "./use-update-certificate";

const mockUseAdd = vi.mocked(useAddCertificate);
const mockUseUpdate = vi.mocked(useUpdateCertificate);
const mockUseDelete = vi.mocked(useDeleteCertificate);

beforeEach(() => {
	vi.clearAllMocks();
	mockUseAdd.mockReturnValue({ mutate: vi.fn(), isPending: false } as never);
	mockUseUpdate.mockReturnValue({ mutate: vi.fn(), isPending: false } as never);
	mockUseDelete.mockReturnValue({ mutate: vi.fn(), isPending: false } as never);
});

describe("CertificateDialog", () => {
	it("não renderiza conteúdo quando open=false", () => {
		const { container } = render(
			<CertificateDialog open={false} onClose={vi.fn()} />,
		);
		expect(container.firstChild).toBeNull();
	});

	it("renderiza título 'Novo certificado' quando não há editing", () => {
		render(<CertificateDialog open={true} onClose={vi.fn()} />);
		expect(screen.getByText("Novo certificado")).toBeInTheDocument();
	});

	it("renderiza título 'Editar certificado' quando há editing", () => {
		render(
			<CertificateDialog
				open={true}
				onClose={vi.fn()}
				editing={{ id: "c-1", title: "Curso Y" } as never}
			/>,
		);
		expect(screen.getByText("Editar certificado")).toBeInTheDocument();
	});

	it("chama useAddCertificate.mutate ao submeter sem editing", async () => {
		const addMutate = vi.fn();
		mockUseAdd.mockReturnValue({
			mutate: addMutate,
			isPending: false,
		} as never);
		render(<CertificateDialog open={true} onClose={vi.fn()} />);
		await userEvent.click(screen.getByText("submit-form"));
		expect(addMutate).toHaveBeenCalledTimes(1);
	});

	it("chama useUpdateCertificate.mutate ao submeter com editing", async () => {
		const updateMutate = vi.fn();
		mockUseUpdate.mockReturnValue({
			mutate: updateMutate,
			isPending: false,
		} as never);
		render(
			<CertificateDialog
				open={true}
				onClose={vi.fn()}
				editing={{ id: "c-1", title: "Curso Y" } as never}
			/>,
		);
		await userEvent.click(screen.getByText("submit-form"));
		expect(updateMutate).toHaveBeenCalledTimes(1);
	});

	it("chama onClose ao fechar o formulário interno", async () => {
		const onClose = vi.fn();
		render(<CertificateDialog open={true} onClose={onClose} />);
		await userEvent.click(screen.getByText("close-form"));
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});

describe("CertificateList", () => {
	it("renderiza mensagem de lista vazia quando não há certificados", () => {
		render(<CertificateList professional={{ certificates: [] } as never} />);
		expect(
			screen.getByText("Nenhum certificado cadastrado."),
		).toBeInTheDocument();
	});

	it("renderiza um item por certificado existente", () => {
		render(
			<CertificateList
				professional={
					{
						certificates: [
							{ id: "c-1", title: "Curso A", issuingOrganization: "Inst A" },
							{ id: "c-2", title: "Curso B", issuingOrganization: "Inst B" },
						],
					} as never
				}
			/>,
		);
		expect(screen.getByText("Curso A")).toBeInTheDocument();
		expect(screen.getByText("Curso B")).toBeInTheDocument();
	});

	it("abre o dialog de edição ao clicar em editar um item", async () => {
		render(
			<CertificateList
				professional={
					{
						certificates: [
							{ id: "c-1", title: "Curso A", issuingOrganization: "Inst A" },
						],
					} as never
				}
			/>,
		);
		const buttons = screen.getAllByRole("button");
		// último botão é "Adicionar"; os dois anteriores no item são editar/excluir
		await userEvent.click(buttons[buttons.length - 2]);
		expect(screen.getByText("Editar certificado")).toBeInTheDocument();
	});

	it("chama deleteCert.mutate ao clicar em excluir um item", async () => {
		const deleteMutate = vi.fn();
		mockUseDelete.mockReturnValue({
			mutate: deleteMutate,
			isPending: false,
		} as never);
		render(
			<CertificateList
				professional={
					{
						certificates: [
							{ id: "c-1", title: "Curso A", issuingOrganization: "Inst A" },
						],
					} as never
				}
			/>,
		);
		const buttons = screen.getAllByRole("button");
		await userEvent.click(buttons[buttons.length - 1]);
		expect(deleteMutate).toHaveBeenCalledWith("c-1", expect.any(Object));
	});
});

describe("CertificateListItem", () => {
	const cert = {
		id: "c-1",
		title: "Curso de Emergência",
		issuingOrganization: "Hospital X",
		issueYear: 2020,
		certificateUrl: "https://example.com/cert",
	} as never;

	it("renderiza título, instituição e ano", () => {
		render(
			<ul>
				<CertificateListItem
					cert={cert}
					onEdit={vi.fn()}
					onDelete={vi.fn()}
					deleting={false}
				/>
			</ul>,
		);
		expect(screen.getByText("Curso de Emergência")).toBeInTheDocument();
		expect(screen.getByText(/Hospital X/)).toBeInTheDocument();
		expect(screen.getByText(/2020/)).toBeInTheDocument();
	});

	it("chama onEdit com o certificado ao clicar em editar", async () => {
		const onEdit = vi.fn();
		render(
			<ul>
				<CertificateListItem
					cert={cert}
					onEdit={onEdit}
					onDelete={vi.fn()}
					deleting={false}
				/>
			</ul>,
		);
		const buttons = screen.getAllByRole("button");
		await userEvent.click(buttons[0]);
		expect(onEdit).toHaveBeenCalledWith(cert);
	});

	it("chama onDelete com o id ao clicar em excluir", async () => {
		const onDelete = vi.fn();
		render(
			<ul>
				<CertificateListItem
					cert={cert}
					onEdit={vi.fn()}
					onDelete={onDelete}
					deleting={false}
				/>
			</ul>,
		);
		const buttons = screen.getAllByRole("button");
		await userEvent.click(buttons[1]);
		expect(onDelete).toHaveBeenCalledWith("c-1");
	});

	it("desabilita o botão de excluir quando deleting=true", () => {
		render(
			<ul>
				<CertificateListItem
					cert={cert}
					onEdit={vi.fn()}
					onDelete={vi.fn()}
					deleting={true}
				/>
			</ul>,
		);
		const buttons = screen.getAllByRole("button");
		expect(buttons[1]).toBeDisabled();
	});
});
