import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Testes de VaccineList: lista vazia, lista com itens e callback
// de deletar vacina.

const { vaccines, deleteMutate, deleteIsPending } = vi.hoisted(() => ({
	vaccines: {
		value: [] as {
			id: string;
			vaccineName: string;
			doseNumber?: string;
			administeredAt?: string;
			notes?: string;
		}[],
	},
	deleteMutate: vi.fn(),
	deleteIsPending: { value: false },
}));

vi.mock("@/features/patients", () => ({
	useVaccines: () => ({ data: vaccines.value }),
	useDeleteVaccine: () => ({
		mutate: deleteMutate,
		isPending: deleteIsPending.value,
	}),
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock("./VaccineDialog", () => ({
	VaccineDialog: ({ open }: { open: boolean }) =>
		open ? <div data-testid="dialog">dialog-aberto</div> : null,
}));

import { toast } from "sonner";
import { VaccineList } from "./VaccineList";

beforeEach(() => {
	vaccines.value = [];
	deleteMutate.mockReset();
	deleteIsPending.value = false;
});

describe("VaccineList", () => {
	it("exibe mensagem quando não há vacinas", () => {
		render(<VaccineList />);
		expect(screen.getByText("Nenhuma vacina registrada.")).toBeInTheDocument();
	});

	it("renderiza o nome e a dose da vacina", () => {
		vaccines.value = [
			{ id: "v1", vaccineName: "Hepatite B", doseNumber: "1ª dose" },
		];
		render(<VaccineList />);
		expect(screen.getByText("Hepatite B – 1ª dose")).toBeInTheDocument();
	});

	it("renderiza a data e as observações quando presentes", () => {
		vaccines.value = [
			{
				id: "v1",
				vaccineName: "Gripe",
				administeredAt: "2026-03-01",
				notes: "Reação leve",
			},
		];
		render(<VaccineList />);
		expect(screen.getByText("2026-03-01 · Reação leve")).toBeInTheDocument();
	});

	it("abre o dialog de nova vacina ao clicar em Adicionar", async () => {
		render(<VaccineList />);
		await userEvent.click(screen.getByText("Adicionar"));
		expect(screen.getByTestId("dialog")).toBeInTheDocument();
	});

	it("chama deleteVaccine.mutate ao excluir uma vacina", async () => {
		vaccines.value = [{ id: "v1", vaccineName: "Hepatite B" }];
		render(<VaccineList />);
		const buttons = screen.getAllByRole("button");
		await userEvent.click(buttons[buttons.length - 1]);
		expect(deleteMutate).toHaveBeenCalledWith("v1", expect.any(Object));
	});

	it("mostra toast de sucesso ao remover vacina", async () => {
		deleteMutate.mockImplementation((_id, opts) => opts.onSuccess());
		vaccines.value = [{ id: "v1", vaccineName: "Hepatite B" }];
		render(<VaccineList />);
		const buttons = screen.getAllByRole("button");
		await userEvent.click(buttons[buttons.length - 1]);
		expect(toast.success).toHaveBeenCalledWith("Vacina removida.");
	});

	it("mostra toast de erro quando a remoção falha", async () => {
		deleteMutate.mockImplementation((_id, opts) => opts.onError());
		vaccines.value = [{ id: "v1", vaccineName: "Hepatite B" }];
		render(<VaccineList />);
		const buttons = screen.getAllByRole("button");
		await userEvent.click(buttons[buttons.length - 1]);
		expect(toast.error).toHaveBeenCalledWith("Erro ao remover.");
	});

	it("desabilita o botão de excluir quando a exclusão está pendente", () => {
		deleteIsPending.value = true;
		vaccines.value = [{ id: "v1", vaccineName: "Hepatite B" }];
		render(<VaccineList />);
		const buttons = screen.getAllByRole("button");
		expect(buttons[buttons.length - 1]).toBeDisabled();
	});
});
