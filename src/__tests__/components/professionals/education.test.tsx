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
	professionalEducationSchema: {},
	useAddEducation: vi.fn(),
	useUpdateEducation: vi.fn(),
	useDeleteEducation: vi.fn(),
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
vi.mock("@/components/professionals/EducationDialogForm", () => ({
	EducationDialogForm: ({
		onSubmit,
		onClose,
	}: {
		onSubmit: (data: object) => void;
		onClose: () => void;
	}) => (
		<div>
			<button
				type="button"
				onClick={() => onSubmit({ degree: "GRADUATION", institution: "USP" })}
			>
				submit-form
			</button>
			<button type="button" onClick={onClose}>
				close-form
			</button>
		</div>
	),
}));

import { EducationDialog } from "@/components/professionals/EducationDialog";
import { EducationList } from "@/components/professionals/EducationList";
import { EducationListItem } from "@/components/professionals/EducationListItem";
import {
	useAddEducation,
	useDeleteEducation,
	useUpdateEducation,
} from "@/features/professionals";

const mockUseAdd = vi.mocked(useAddEducation);
const mockUseUpdate = vi.mocked(useUpdateEducation);
const mockUseDelete = vi.mocked(useDeleteEducation);

beforeEach(() => {
	vi.clearAllMocks();
	mockUseAdd.mockReturnValue({ mutate: vi.fn(), isPending: false } as never);
	mockUseUpdate.mockReturnValue({ mutate: vi.fn(), isPending: false } as never);
	mockUseDelete.mockReturnValue({ mutate: vi.fn(), isPending: false } as never);
});

describe("EducationDialog", () => {
	it("não renderiza conteúdo quando open=false", () => {
		const { container } = render(
			<EducationDialog open={false} onClose={vi.fn()} />,
		);
		expect(container.firstChild).toBeNull();
	});

	it("renderiza título 'Nova formação' quando não há editing", () => {
		render(<EducationDialog open={true} onClose={vi.fn()} />);
		expect(screen.getByText("Nova formação")).toBeInTheDocument();
	});

	it("renderiza título 'Editar formação' quando há editing", () => {
		render(
			<EducationDialog
				open={true}
				onClose={vi.fn()}
				editing={{ id: "e-1", institution: "USP" } as never}
			/>,
		);
		expect(screen.getByText("Editar formação")).toBeInTheDocument();
	});

	it("chama useAddEducation.mutate ao submeter sem editing", async () => {
		const addMutate = vi.fn();
		mockUseAdd.mockReturnValue({
			mutate: addMutate,
			isPending: false,
		} as never);
		render(<EducationDialog open={true} onClose={vi.fn()} />);
		await userEvent.click(screen.getByText("submit-form"));
		expect(addMutate).toHaveBeenCalledTimes(1);
	});

	it("chama useUpdateEducation.mutate ao submeter com editing", async () => {
		const updateMutate = vi.fn();
		mockUseUpdate.mockReturnValue({
			mutate: updateMutate,
			isPending: false,
		} as never);
		render(
			<EducationDialog
				open={true}
				onClose={vi.fn()}
				editing={{ id: "e-1", institution: "USP" } as never}
			/>,
		);
		await userEvent.click(screen.getByText("submit-form"));
		expect(updateMutate).toHaveBeenCalledTimes(1);
	});

	it("chama onClose ao fechar o formulário interno", async () => {
		const onClose = vi.fn();
		render(<EducationDialog open={true} onClose={onClose} />);
		await userEvent.click(screen.getByText("close-form"));
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});

describe("EducationList", () => {
	it("renderiza mensagem de lista vazia quando não há formações", () => {
		render(<EducationList professional={{ education: [] } as never} />);
		expect(
			screen.getByText("Nenhuma formação cadastrada."),
		).toBeInTheDocument();
	});

	it("renderiza um item por formação existente", () => {
		render(
			<EducationList
				professional={
					{
						education: [
							{ id: "e-1", institution: "USP", degree: "Graduação" },
							{ id: "e-2", institution: "Unicamp", degree: "Mestrado" },
						],
					} as never
				}
			/>,
		);
		expect(screen.getByText("USP")).toBeInTheDocument();
		expect(screen.getByText("Unicamp")).toBeInTheDocument();
	});

	it("abre o dialog de edição ao clicar em editar um item", async () => {
		render(
			<EducationList
				professional={
					{
						education: [{ id: "e-1", institution: "USP", degree: "Graduação" }],
					} as never
				}
			/>,
		);
		const buttons = screen.getAllByRole("button");
		await userEvent.click(buttons[buttons.length - 2]);
		expect(screen.getByText("Editar formação")).toBeInTheDocument();
	});

	it("chama deleteEdu.mutate ao clicar em excluir um item", async () => {
		const deleteMutate = vi.fn();
		mockUseDelete.mockReturnValue({
			mutate: deleteMutate,
			isPending: false,
		} as never);
		render(
			<EducationList
				professional={
					{
						education: [{ id: "e-1", institution: "USP", degree: "Graduação" }],
					} as never
				}
			/>,
		);
		const buttons = screen.getAllByRole("button");
		await userEvent.click(buttons[buttons.length - 1]);
		expect(deleteMutate).toHaveBeenCalledWith("e-1", expect.any(Object));
	});
});

describe("EducationListItem", () => {
	const edu = {
		id: "e-1",
		institution: "USP",
		degree: "Graduação",
		fieldOfStudy: "Medicina",
		graduationYear: 2015,
	} as never;

	it("renderiza instituição, grau, área e ano", () => {
		render(
			<ul>
				<EducationListItem
					edu={edu}
					onEdit={vi.fn()}
					onDelete={vi.fn()}
					deleting={false}
				/>
			</ul>,
		);
		expect(screen.getByText("USP")).toBeInTheDocument();
		expect(screen.getByText(/Graduação/)).toBeInTheDocument();
		expect(screen.getByText(/Medicina/)).toBeInTheDocument();
		expect(screen.getByText(/2015/)).toBeInTheDocument();
	});

	it("chama onEdit com a formação ao clicar em editar", async () => {
		const onEdit = vi.fn();
		render(
			<ul>
				<EducationListItem
					edu={edu}
					onEdit={onEdit}
					onDelete={vi.fn()}
					deleting={false}
				/>
			</ul>,
		);
		const buttons = screen.getAllByRole("button");
		await userEvent.click(buttons[0]);
		expect(onEdit).toHaveBeenCalledWith(edu);
	});

	it("chama onDelete com o id ao clicar em excluir", async () => {
		const onDelete = vi.fn();
		render(
			<ul>
				<EducationListItem
					edu={edu}
					onEdit={vi.fn()}
					onDelete={onDelete}
					deleting={false}
				/>
			</ul>,
		);
		const buttons = screen.getAllByRole("button");
		await userEvent.click(buttons[1]);
		expect(onDelete).toHaveBeenCalledWith("e-1");
	});

	it("desabilita o botão de excluir quando deleting=true", () => {
		render(
			<ul>
				<EducationListItem
					edu={edu}
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
