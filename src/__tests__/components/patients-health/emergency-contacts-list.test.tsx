import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Testes de EmergencyContactList: lista vazia, lista com itens e
// callback de deletar/editar/adicionar contato.

const { contacts, deleteMutate, deleteIsPending } = vi.hoisted(() => ({
	contacts: { value: [] as { id: string; name: string }[] },
	deleteMutate: vi.fn(),
	deleteIsPending: { value: false },
}));

vi.mock("@/features/patients", () => ({
	useEmergencyContacts: () => ({ data: contacts.value }),
	useDeleteEmergencyContact: () => ({
		mutate: deleteMutate,
		isPending: deleteIsPending.value,
	}),
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock("@/components/patients/health/EmergencyContactItem", () => ({
	EmergencyContactItem: ({
		contact,
		onEdit,
		onDelete,
	}: {
		contact: { id: string; name: string };
		onEdit: (c: unknown) => void;
		onDelete: (id: string) => void;
	}) => (
		<li>
			<span>{contact.name}</span>
			<button type="button" onClick={() => onEdit(contact)}>
				editar-{contact.name}
			</button>
			<button type="button" onClick={() => onDelete(contact.id)}>
				excluir-{contact.name}
			</button>
		</li>
	),
}));

vi.mock("@/components/patients/health/EmergencyContactDialog", () => ({
	EmergencyContactDialog: ({
		open,
		editing,
	}: {
		open: boolean;
		editing?: { name: string };
	}) =>
		open ? (
			<div data-testid="dialog">dialog-aberto:{editing?.name ?? "novo"}</div>
		) : null,
}));

import { toast } from "sonner";
import { EmergencyContactList } from "@/components/patients/health/EmergencyContactList";

beforeEach(() => {
	contacts.value = [];
	deleteMutate.mockReset();
	deleteIsPending.value = false;
});

describe("EmergencyContactList", () => {
	it("exibe mensagem quando não há contatos", () => {
		render(<EmergencyContactList />);
		expect(screen.getByText("Nenhum contato cadastrado.")).toBeInTheDocument();
	});

	it("renderiza um item por contato cadastrado", () => {
		contacts.value = [
			{ id: "c1", name: "Ana Souza" },
			{ id: "c2", name: "Bruno Lima" },
		];
		render(<EmergencyContactList />);
		expect(screen.getByText("Ana Souza")).toBeInTheDocument();
		expect(screen.getByText("Bruno Lima")).toBeInTheDocument();
	});

	it("abre o dialog para novo contato ao clicar em Adicionar", async () => {
		render(<EmergencyContactList />);
		await userEvent.click(screen.getByText("Adicionar"));
		expect(screen.getByTestId("dialog")).toHaveTextContent(
			"dialog-aberto:novo",
		);
	});

	it("abre o dialog em modo de edição ao clicar em editar um contato", async () => {
		contacts.value = [{ id: "c1", name: "Ana Souza" }];
		render(<EmergencyContactList />);
		await userEvent.click(screen.getByText("editar-Ana Souza"));
		expect(screen.getByTestId("dialog")).toHaveTextContent(
			"dialog-aberto:Ana Souza",
		);
	});

	it("chama deleteContact.mutate ao excluir um contato", async () => {
		contacts.value = [{ id: "c1", name: "Ana Souza" }];
		render(<EmergencyContactList />);
		await userEvent.click(screen.getByText("excluir-Ana Souza"));
		expect(deleteMutate).toHaveBeenCalledWith("c1", expect.any(Object));
	});

	it("mostra toast de sucesso ao remover contato", async () => {
		deleteMutate.mockImplementation((_id, opts) => opts.onSuccess());
		contacts.value = [{ id: "c1", name: "Ana Souza" }];
		render(<EmergencyContactList />);
		await userEvent.click(screen.getByText("excluir-Ana Souza"));
		expect(toast.success).toHaveBeenCalledWith("Contato removido.");
	});

	it("mostra toast de erro quando a remoção falha", async () => {
		deleteMutate.mockImplementation((_id, opts) => opts.onError());
		contacts.value = [{ id: "c1", name: "Ana Souza" }];
		render(<EmergencyContactList />);
		await userEvent.click(screen.getByText("excluir-Ana Souza"));
		expect(toast.error).toHaveBeenCalledWith("Erro ao remover.");
	});
});
