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
	professionalExperienceSchema: {},
	useAddExperience: vi.fn(),
	useUpdateExperience: vi.fn(),
	useDeleteExperience: vi.fn(),
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
vi.mock("./ExperienceDialogForm", () => ({
	ExperienceDialogForm: ({
		onSubmit,
		onClose,
	}: {
		onSubmit: (data: object) => void;
		onClose: () => void;
	}) => (
		<div>
			<button
				type="button"
				onClick={() => onSubmit({ position: "Clínico", institution: "HC" })}
			>
				submit-form
			</button>
			<button type="button" onClick={onClose}>
				close-form
			</button>
		</div>
	),
}));

import {
	useAddExperience,
	useDeleteExperience,
	useUpdateExperience,
} from "@/features/professionals";
import { ExperienceDialog } from "./ExperienceDialog";
import { ExperienceList } from "./ExperienceList";
import { ExperienceListItem } from "./ExperienceListItem";

const mockUseAdd = vi.mocked(useAddExperience);
const mockUseUpdate = vi.mocked(useUpdateExperience);
const mockUseDelete = vi.mocked(useDeleteExperience);

beforeEach(() => {
	vi.clearAllMocks();
	mockUseAdd.mockReturnValue({ mutate: vi.fn(), isPending: false } as never);
	mockUseUpdate.mockReturnValue({ mutate: vi.fn(), isPending: false } as never);
	mockUseDelete.mockReturnValue({ mutate: vi.fn(), isPending: false } as never);
});

describe("ExperienceDialog", () => {
	it("não renderiza conteúdo quando open=false", () => {
		const { container } = render(
			<ExperienceDialog open={false} onClose={vi.fn()} />,
		);
		expect(container.firstChild).toBeNull();
	});

	it("renderiza título 'Nova experiência' quando não há editing", () => {
		render(<ExperienceDialog open={true} onClose={vi.fn()} />);
		expect(screen.getByText("Nova experiência")).toBeInTheDocument();
	});

	it("renderiza título 'Editar experiência' quando há editing", () => {
		render(
			<ExperienceDialog
				open={true}
				onClose={vi.fn()}
				editing={{ id: "x-1", position: "Clínico" } as never}
			/>,
		);
		expect(screen.getByText("Editar experiência")).toBeInTheDocument();
	});

	it("chama useAddExperience.mutate ao submeter sem editing", async () => {
		const addMutate = vi.fn();
		mockUseAdd.mockReturnValue({
			mutate: addMutate,
			isPending: false,
		} as never);
		render(<ExperienceDialog open={true} onClose={vi.fn()} />);
		await userEvent.click(screen.getByText("submit-form"));
		expect(addMutate).toHaveBeenCalledTimes(1);
	});

	it("chama useUpdateExperience.mutate ao submeter com editing", async () => {
		const updateMutate = vi.fn();
		mockUseUpdate.mockReturnValue({
			mutate: updateMutate,
			isPending: false,
		} as never);
		render(
			<ExperienceDialog
				open={true}
				onClose={vi.fn()}
				editing={{ id: "x-1", position: "Clínico" } as never}
			/>,
		);
		await userEvent.click(screen.getByText("submit-form"));
		expect(updateMutate).toHaveBeenCalledTimes(1);
	});

	it("chama onClose ao fechar o formulário interno", async () => {
		const onClose = vi.fn();
		render(<ExperienceDialog open={true} onClose={onClose} />);
		await userEvent.click(screen.getByText("close-form"));
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});

describe("ExperienceList", () => {
	it("renderiza mensagem de lista vazia quando não há experiências", () => {
		render(<ExperienceList professional={{ experience: [] } as never} />);
		expect(
			screen.getByText("Nenhuma experiência cadastrada."),
		).toBeInTheDocument();
	});

	it("renderiza um item por experiência existente", () => {
		render(
			<ExperienceList
				professional={
					{
						experience: [
							{ id: "x-1", position: "Clínico Geral", institution: "HC" },
							{ id: "x-2", position: "Cardiologista", institution: "HSP" },
						],
					} as never
				}
			/>,
		);
		expect(screen.getByText("Clínico Geral")).toBeInTheDocument();
		expect(screen.getByText("Cardiologista")).toBeInTheDocument();
	});

	it("abre o dialog de edição ao clicar em editar um item", async () => {
		render(
			<ExperienceList
				professional={
					{
						experience: [
							{ id: "x-1", position: "Clínico Geral", institution: "HC" },
						],
					} as never
				}
			/>,
		);
		const buttons = screen.getAllByRole("button");
		await userEvent.click(buttons[buttons.length - 2]);
		expect(screen.getByText("Editar experiência")).toBeInTheDocument();
	});

	it("chama deleteExp.mutate ao clicar em excluir um item", async () => {
		const deleteMutate = vi.fn();
		mockUseDelete.mockReturnValue({
			mutate: deleteMutate,
			isPending: false,
		} as never);
		render(
			<ExperienceList
				professional={
					{
						experience: [
							{ id: "x-1", position: "Clínico Geral", institution: "HC" },
						],
					} as never
				}
			/>,
		);
		const buttons = screen.getAllByRole("button");
		await userEvent.click(buttons[buttons.length - 1]);
		expect(deleteMutate).toHaveBeenCalledWith("x-1", expect.any(Object));
	});
});

describe("ExperienceListItem", () => {
	const exp = {
		id: "x-1",
		position: "Clínico Geral",
		institution: "HC",
		startYear: 2015,
		endYear: 2020,
		description: "Atendimentos gerais.",
	} as never;

	it("renderiza cargo, instituição, período e descrição", () => {
		render(
			<ul>
				<ExperienceListItem
					exp={exp}
					onEdit={vi.fn()}
					onDelete={vi.fn()}
					deleting={false}
				/>
			</ul>,
		);
		expect(screen.getByText("Clínico Geral")).toBeInTheDocument();
		expect(screen.getByText(/HC · 2015–2020/)).toBeInTheDocument();
		expect(screen.getByText("Atendimentos gerais.")).toBeInTheDocument();
	});

	it("renderiza 'atual' quando não há endYear", () => {
		render(
			<ul>
				<ExperienceListItem
					exp={{ ...exp, endYear: null }}
					onEdit={vi.fn()}
					onDelete={vi.fn()}
					deleting={false}
				/>
			</ul>,
		);
		expect(screen.getByText(/HC · 2015–atual/)).toBeInTheDocument();
	});

	it("chama onEdit com a experiência ao clicar em editar", async () => {
		const onEdit = vi.fn();
		render(
			<ul>
				<ExperienceListItem
					exp={exp}
					onEdit={onEdit}
					onDelete={vi.fn()}
					deleting={false}
				/>
			</ul>,
		);
		const buttons = screen.getAllByRole("button");
		await userEvent.click(buttons[0]);
		expect(onEdit).toHaveBeenCalledWith(exp);
	});

	it("chama onDelete com o id ao clicar em excluir", async () => {
		const onDelete = vi.fn();
		render(
			<ul>
				<ExperienceListItem
					exp={exp}
					onEdit={vi.fn()}
					onDelete={onDelete}
					deleting={false}
				/>
			</ul>,
		);
		const buttons = screen.getAllByRole("button");
		await userEvent.click(buttons[1]);
		expect(onDelete).toHaveBeenCalledWith("x-1");
	});

	it("desabilita o botão de excluir quando deleting=true", () => {
		render(
			<ul>
				<ExperienceListItem
					exp={exp}
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
