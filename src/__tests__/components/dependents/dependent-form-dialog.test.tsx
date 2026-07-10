import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const { mockUseDependentForm } = vi.hoisted(() => ({
	mockUseDependentForm: vi.fn(),
}));

vi.mock("@/components/dependents/use-dependent-form", () => ({
	useDependentForm: mockUseDependentForm,
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
		<h2>{children}</h2>
	),
}));
vi.mock("@/components/ui/form", () => ({
	Form: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	FormField: ({
		name,
		render,
	}: {
		name: string;
		render: (arg: { field: object }) => React.ReactNode;
	}) => <div>{render({ field: { value: "", onChange: vi.fn(), name } })}</div>,
	FormItem: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	FormLabel: ({ children }: { children: React.ReactNode }) => (
		<span>{children}</span>
	),
	FormControl: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	FormMessage: () => null,
}));
vi.mock("@/components/ui/input", () => ({
	Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
		<input {...props} />
	),
}));
vi.mock("@/components/ui/select", () => ({
	Select: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SelectTrigger: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SelectValue: () => null,
	SelectContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SelectItem: ({
		children,
		value,
	}: {
		children: React.ReactNode;
		value: string;
	}) => <div data-value={value}>{children}</div>,
}));
vi.mock("@/components/ui/button", () => ({
	Button: ({
		children,
		onClick,
		disabled,
		type,
	}: {
		children: React.ReactNode;
		onClick?: () => void;
		disabled?: boolean;
		type?: "button" | "submit";
	}) => (
		<button type={type ?? "button"} onClick={onClick} disabled={disabled}>
			{children}
		</button>
	),
}));

import { DependentFormDialog } from "@/components/dependents/DependentFormDialog";

function buildForm(onSubmitSpy: (data: unknown) => void) {
	return {
		control: {},
		handleSubmit: (fn: (data: unknown) => void) => (e: React.FormEvent) => {
			e.preventDefault();
			fn({ name: "Maria" });
			onSubmitSpy({ name: "Maria" });
		},
	} as never;
}

describe("DependentFormDialog", () => {
	it("não renderiza nada quando open=false", () => {
		mockUseDependentForm.mockReturnValue({
			form: buildForm(vi.fn()),
			onSubmit: vi.fn(),
			isPending: false,
		});
		const { container } = render(
			<DependentFormDialog open={false} onClose={vi.fn()} />,
		);
		expect(container.firstChild).toBeNull();
	});

	it("mostra o título 'Adicionar dependente' quando não há edição", () => {
		mockUseDependentForm.mockReturnValue({
			form: buildForm(vi.fn()),
			onSubmit: vi.fn(),
			isPending: false,
		});
		render(<DependentFormDialog open={true} onClose={vi.fn()} />);
		expect(screen.getByText("Adicionar dependente")).toBeInTheDocument();
	});

	it("mostra o título 'Editar dependente' quando há um dependente em edição", () => {
		mockUseDependentForm.mockReturnValue({
			form: buildForm(vi.fn()),
			onSubmit: vi.fn(),
			isPending: false,
		});
		render(
			<DependentFormDialog
				open={true}
				onClose={vi.fn()}
				editing={{ id: "d-1", name: "João" } as never}
			/>,
		);
		expect(screen.getByText("Editar dependente")).toBeInTheDocument();
	});

	it("renderiza os campos do formulário de dependente", () => {
		mockUseDependentForm.mockReturnValue({
			form: buildForm(vi.fn()),
			onSubmit: vi.fn(),
			isPending: false,
		});
		render(<DependentFormDialog open={true} onClose={vi.fn()} />);
		expect(screen.getByText("Nome *")).toBeInTheDocument();
		expect(screen.getByText("Relação *")).toBeInTheDocument();
	});

	it("chama onClose ao clicar em Cancelar", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		mockUseDependentForm.mockReturnValue({
			form: buildForm(vi.fn()),
			onSubmit: vi.fn(),
			isPending: false,
		});
		render(<DependentFormDialog open={true} onClose={onClose} />);
		await user.click(screen.getByText("Cancelar"));
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("chama onSubmit do hook ao submeter o formulário", async () => {
		const user = userEvent.setup();
		const onSubmitSpy = vi.fn();
		mockUseDependentForm.mockReturnValue({
			form: buildForm(onSubmitSpy),
			onSubmit: vi.fn(),
			isPending: false,
		});
		render(<DependentFormDialog open={true} onClose={vi.fn()} />);
		await user.click(screen.getByText("Salvar"));
		expect(onSubmitSpy).toHaveBeenCalledWith({ name: "Maria" });
	});

	it("desabilita o botão de salvar e mostra 'Salvando...' quando isPending=true", () => {
		mockUseDependentForm.mockReturnValue({
			form: buildForm(vi.fn()),
			onSubmit: vi.fn(),
			isPending: true,
		});
		render(<DependentFormDialog open={true} onClose={vi.fn()} />);
		expect(screen.getByText("Salvando...")).toBeInTheDocument();
		expect(screen.getByText("Salvando...").closest("button")).toBeDisabled();
	});
});
