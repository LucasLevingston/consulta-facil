import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createContext, useContext } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/features/professionals", async (importOriginal) => {
	const actual =
		await importOriginal<typeof import("@/features/professionals")>();
	return {
		...actual,
		useCreateProfessional: vi.fn(),
	};
});

type SelectCtxValue = { onValueChange?: (v: string) => void };
const SelectCtx = createContext<SelectCtxValue>({});

vi.mock("@/components/ui/select", () => ({
	Select: ({
		children,
		value,
		disabled,
		onValueChange,
	}: {
		children: React.ReactNode;
		value?: string;
		disabled?: boolean;
		onValueChange?: (v: string) => void;
	}) => (
		<SelectCtx.Provider value={{ onValueChange }}>
			<div data-testid="select" data-value={value} data-disabled={disabled}>
				{children}
			</div>
		</SelectCtx.Provider>
	),
	SelectTrigger: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SelectValue: ({ placeholder }: { placeholder?: string }) => (
		<span>{placeholder}</span>
	),
	SelectContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SelectGroup: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SelectItem: ({
		children,
		value,
	}: {
		children: React.ReactNode;
		value: string;
	}) => {
		const { onValueChange } = useContext(SelectCtx);
		return (
			<button type="button" onClick={() => onValueChange?.(value)}>
				{children}
			</button>
		);
	},
}));

import { toast } from "sonner";
import { BecomeProfessionalForm } from "@/components/become-professional/BecomeProfessionalForm";
import { useCreateProfessional } from "@/features/professionals";

const mockUseCreateProfessional = vi.mocked(useCreateProfessional);

beforeEach(() => {
	vi.clearAllMocks();
	mockUseCreateProfessional.mockReturnValue({
		mutateAsync: vi.fn().mockResolvedValue(undefined),
		isPending: false,
	} as never);
});

describe("BecomeProfessionalForm", () => {
	it("renderiza o título 'Dados profissionais'", () => {
		render(<BecomeProfessionalForm />);
		expect(screen.getByText("Dados profissionais")).toBeInTheDocument();
	});

	it("renderiza os placeholders iniciais de profissão e especialidade", () => {
		render(<BecomeProfessionalForm />);
		expect(screen.getByText("Selecione sua profissão")).toBeInTheDocument();
		expect(
			screen.getByText("Primeiro selecione a profissão"),
		).toBeInTheDocument();
	});

	it("desabilita o select de especialidade antes de escolher a profissão", () => {
		render(<BecomeProfessionalForm />);
		const selects = screen.getAllByTestId("select");
		// segundo select é o de especialidade
		expect(selects[1]).toHaveAttribute("data-disabled", "true");
	});

	it("mostra as especialidades da profissão escolhida e atualiza o placeholder", async () => {
		const user = userEvent.setup();
		render(<BecomeProfessionalForm />);
		await user.click(screen.getByText("Médico"));
		expect(screen.getByText("Selecione sua especialidade")).toBeInTheDocument();
		expect(screen.getByText("Cardiologia")).toBeInTheDocument();
	});

	it("atualiza a dica de registro conforme a profissão selecionada", async () => {
		const user = userEvent.setup();
		render(<BecomeProfessionalForm />);
		await user.click(screen.getByText("Psicólogo"));
		expect(
			screen.getByPlaceholderText("Ex: CRP/SP 123456"),
		).toBeInTheDocument();
	});

	it("envia a solicitação e mostra toast de sucesso ao submeter dados válidos", async () => {
		const user = userEvent.setup();
		const mutateAsync = vi.fn().mockResolvedValue(undefined);
		mockUseCreateProfessional.mockReturnValue({
			mutateAsync,
			isPending: false,
		} as never);
		render(<BecomeProfessionalForm />);

		await user.click(screen.getByText("Médico"));
		await user.click(screen.getByText("Cardiologia"));
		await user.type(
			screen.getByPlaceholderText("Ex: CRM/SP 123456"),
			"CRM/SP 123456",
		);
		await user.click(screen.getByText("Enviar solicitação"));

		expect(mutateAsync).toHaveBeenCalledWith({
			profession: "MEDICO",
			specialty: "CARDIOLOGIA",
			licenseNumber: "CRM/SP 123456",
		});
		expect(toast.success).toHaveBeenCalledWith(
			"Solicitação enviada com sucesso!",
			expect.objectContaining({
				description: "Sua candidatura está em análise. Aguarde a aprovação.",
			}),
		);
	});

	it("mostra toast de erro quando a mutation falha", async () => {
		const user = userEvent.setup();
		const mutateAsync = vi.fn().mockRejectedValue(new Error("fail"));
		mockUseCreateProfessional.mockReturnValue({
			mutateAsync,
			isPending: false,
		} as never);
		render(<BecomeProfessionalForm />);

		await user.click(screen.getByText("Médico"));
		await user.click(screen.getByText("Cardiologia"));
		await user.type(
			screen.getByPlaceholderText("Ex: CRM/SP 123456"),
			"CRM/SP 123456",
		);
		await user.click(screen.getByText("Enviar solicitação"));

		expect(toast.error).toHaveBeenCalledWith(
			"Erro ao enviar solicitação",
			expect.objectContaining({
				description: "Verifique os dados e tente novamente.",
			}),
		);
	});
});
