import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

// Testes de EmergencyContactItem: renderização dos dados do contato
// e callbacks de editar/deletar.

vi.mock("@/features/patients", () => ({
	RELATIONSHIP_LABELS: {
		MOTHER: "Mãe",
		FATHER: "Pai",
		SPOUSE: "Cônjuge",
		SIBLING: "Irmão(ã)",
		CHILD: "Filho(a)",
		FRIEND: "Amigo(a)",
		OTHER: "Outro",
	},
}));

import { EmergencyContactItem } from "./EmergencyContactItem";

const contact = {
	id: "c1",
	name: "Ana Souza",
	phone: "(11) 99999-0000",
	email: "ana@email.com",
	relationship: "MOTHER" as const,
};

describe("EmergencyContactItem", () => {
	it("renderiza o nome do contato", () => {
		render(
			<EmergencyContactItem
				contact={contact}
				onEdit={vi.fn()}
				onDelete={vi.fn()}
				isDeleting={false}
			/>,
		);
		expect(screen.getByText("Ana Souza")).toBeInTheDocument();
	});

	it("renderiza o label de parentesco traduzido", () => {
		render(
			<EmergencyContactItem
				contact={contact}
				onEdit={vi.fn()}
				onDelete={vi.fn()}
				isDeleting={false}
			/>,
		);
		expect(screen.getByText("Mãe")).toBeInTheDocument();
	});

	it("renderiza telefone e e-mail juntos", () => {
		render(
			<EmergencyContactItem
				contact={contact}
				onEdit={vi.fn()}
				onDelete={vi.fn()}
				isDeleting={false}
			/>,
		);
		expect(
			screen.getByText("(11) 99999-0000 · ana@email.com"),
		).toBeInTheDocument();
	});

	it("não renderiza e-mail quando ausente", () => {
		render(
			<EmergencyContactItem
				contact={{ ...contact, email: undefined }}
				onEdit={vi.fn()}
				onDelete={vi.fn()}
				isDeleting={false}
			/>,
		);
		expect(screen.getByText("(11) 99999-0000")).toBeInTheDocument();
	});

	it("não renderiza parentesco quando ausente", () => {
		render(
			<EmergencyContactItem
				contact={{ ...contact, relationship: undefined }}
				onEdit={vi.fn()}
				onDelete={vi.fn()}
				isDeleting={false}
			/>,
		);
		expect(screen.queryByText("Mãe")).not.toBeInTheDocument();
	});

	it("chama onEdit com o contato ao clicar em editar", async () => {
		const onEdit = vi.fn();
		render(
			<EmergencyContactItem
				contact={contact}
				onEdit={onEdit}
				onDelete={vi.fn()}
				isDeleting={false}
			/>,
		);
		await userEvent.click(screen.getAllByRole("button")[0]);
		expect(onEdit).toHaveBeenCalledWith(contact);
	});

	it("chama onDelete com o id ao clicar em excluir", async () => {
		const onDelete = vi.fn();
		render(
			<EmergencyContactItem
				contact={contact}
				onEdit={vi.fn()}
				onDelete={onDelete}
				isDeleting={false}
			/>,
		);
		await userEvent.click(screen.getAllByRole("button")[1]);
		expect(onDelete).toHaveBeenCalledWith("c1");
	});

	it("desabilita o botão de excluir quando isDeleting=true", () => {
		render(
			<EmergencyContactItem
				contact={contact}
				onEdit={vi.fn()}
				onDelete={vi.fn()}
				isDeleting={true}
			/>,
		);
		expect(screen.getAllByRole("button")[1]).toBeDisabled();
	});
});
