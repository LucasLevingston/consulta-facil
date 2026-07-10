import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Testes de EmergencyContactDialog, EmergencyContactDialogForm e
// EmergencyContactPhoneFields: abertura, preenchimento e submit
// chamando a mutation correta de contato de emergência.

const { addMutate, updateMutate } = vi.hoisted(() => ({
	addMutate: vi.fn(),
	updateMutate: vi.fn(),
}));

vi.mock("@hookform/resolvers/zod", () => ({
	zodResolver: vi.fn(() => (values: Record<string, unknown>) => ({
		values,
		errors: {},
	})),
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock("@/features/patients", () => ({
	emergencyContactSchema: {},
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
vi.mock("./use-add-emergency-contact", () => ({
	useAddEmergencyContact: () => ({ mutate: addMutate, isPending: false }),
}));
vi.mock("./use-update-emergency-contact", () => ({
	useUpdateEmergencyContact: () => ({ mutate: updateMutate, isPending: false }),
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

import { toast } from "sonner";
import { EmergencyContactDialog } from "./EmergencyContactDialog";
import { EmergencyContactDialogForm } from "./EmergencyContactDialogForm";
import { EmergencyContactPhoneFields } from "./EmergencyContactPhoneFields";

beforeEach(() => {
	addMutate.mockReset();
	updateMutate.mockReset();
});

describe("EmergencyContactPhoneFields", () => {
	it("renderiza os labels 'Parentesco' e 'Telefone'", () => {
		render(<EmergencyContactPhoneFields control={{} as never} />);
		expect(screen.getByText("Parentesco")).toBeInTheDocument();
		expect(screen.getByText("Telefone")).toBeInTheDocument();
	});

	it("renderiza todas as opções de parentesco", () => {
		render(<EmergencyContactPhoneFields control={{} as never} />);
		expect(screen.getByText("Mãe")).toBeInTheDocument();
		expect(screen.getByText("Pai")).toBeInTheDocument();
		expect(screen.getByText("Cônjuge")).toBeInTheDocument();
		expect(screen.getByText("Amigo(a)")).toBeInTheDocument();
	});
});

describe("EmergencyContactDialogForm", () => {
	const form = {
		control: {},
		handleSubmit: (fn: (data: object) => void) => (e: React.FormEvent) => {
			e.preventDefault();
			fn({});
		},
	} as never;

	it("renderiza o label 'Nome' e 'E-mail (opcional)'", () => {
		render(
			<EmergencyContactDialogForm
				form={form}
				isPending={false}
				onSubmit={vi.fn()}
				onClose={vi.fn()}
			/>,
		);
		expect(screen.getByText("Nome")).toBeInTheDocument();
		expect(screen.getByText("E-mail (opcional)")).toBeInTheDocument();
	});

	it("renderiza os botões Cancelar e Salvar", () => {
		render(
			<EmergencyContactDialogForm
				form={form}
				isPending={false}
				onSubmit={vi.fn()}
				onClose={vi.fn()}
			/>,
		);
		expect(screen.getByText("Cancelar")).toBeInTheDocument();
		expect(screen.getByText("Salvar")).toBeInTheDocument();
	});

	it("exibe 'Salvando...' quando isPending=true", () => {
		render(
			<EmergencyContactDialogForm
				form={form}
				isPending={true}
				onSubmit={vi.fn()}
				onClose={vi.fn()}
			/>,
		);
		expect(screen.getByText("Salvando...")).toBeInTheDocument();
	});

	it("chama onClose ao clicar em Cancelar", async () => {
		const onClose = vi.fn();
		render(
			<EmergencyContactDialogForm
				form={form}
				isPending={false}
				onSubmit={vi.fn()}
				onClose={onClose}
			/>,
		);
		await userEvent.click(screen.getByText("Cancelar"));
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});

describe("EmergencyContactDialog", () => {
	it("renderiza o título 'Novo contato de emergência' quando não há edição", () => {
		render(<EmergencyContactDialog open={true} onClose={vi.fn()} />);
		expect(screen.getByText("Novo contato de emergência")).toBeInTheDocument();
	});

	it("renderiza o título 'Editar contato' quando editing é informado", () => {
		render(
			<EmergencyContactDialog
				open={true}
				onClose={vi.fn()}
				editing={{ id: "c1", name: "Ana", phone: "11999999999" }}
			/>,
		);
		expect(screen.getByText("Editar contato")).toBeInTheDocument();
	});

	it("renderiza nada quando open=false", () => {
		const { container } = render(
			<EmergencyContactDialog open={false} onClose={vi.fn()} />,
		);
		expect(container.firstChild).toBeNull();
	});

	it("chama add.mutate ao submeter um novo contato", async () => {
		render(<EmergencyContactDialog open={true} onClose={vi.fn()} />);
		await userEvent.click(screen.getByText("Salvar"));
		expect(addMutate).toHaveBeenCalledWith(
			expect.any(Object),
			expect.any(Object),
		);
		expect(updateMutate).not.toHaveBeenCalled();
	});

	it("chama update.mutate com o id ao editar um contato existente", async () => {
		render(
			<EmergencyContactDialog
				open={true}
				onClose={vi.fn()}
				editing={{ id: "c1", name: "Ana", phone: "11999999999" }}
			/>,
		);
		await userEvent.click(screen.getByText("Salvar"));
		expect(updateMutate).toHaveBeenCalledWith(
			{ id: "c1", data: expect.any(Object) },
			expect.any(Object),
		);
		expect(addMutate).not.toHaveBeenCalled();
	});

	it("mostra toast de sucesso e fecha o dialog ao adicionar com sucesso", async () => {
		addMutate.mockImplementation((_data, opts) => opts.onSuccess());
		const onClose = vi.fn();
		render(<EmergencyContactDialog open={true} onClose={onClose} />);
		await userEvent.click(screen.getByText("Salvar"));
		expect(toast.success).toHaveBeenCalledWith("Contato adicionado!");
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("mostra toast de erro quando adicionar falha", async () => {
		addMutate.mockImplementation((_data, opts) => opts.onError());
		render(<EmergencyContactDialog open={true} onClose={vi.fn()} />);
		await userEvent.click(screen.getByText("Salvar"));
		expect(toast.error).toHaveBeenCalledWith("Erro ao adicionar.");
	});

	it("mostra toast de sucesso ao atualizar contato existente", async () => {
		updateMutate.mockImplementation((_data, opts) => opts.onSuccess());
		render(
			<EmergencyContactDialog
				open={true}
				onClose={vi.fn()}
				editing={{ id: "c1", name: "Ana", phone: "11999999999" }}
			/>,
		);
		await userEvent.click(screen.getByText("Salvar"));
		expect(toast.success).toHaveBeenCalledWith("Contato atualizado!");
	});

	it("mostra toast de erro quando atualizar falha", async () => {
		updateMutate.mockImplementation((_data, opts) => opts.onError());
		render(
			<EmergencyContactDialog
				open={true}
				onClose={vi.fn()}
				editing={{ id: "c1", name: "Ana", phone: "11999999999" }}
			/>,
		);
		await userEvent.click(screen.getByText("Salvar"));
		expect(toast.error).toHaveBeenCalledWith("Erro ao atualizar.");
	});
});
