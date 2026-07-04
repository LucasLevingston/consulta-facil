import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@hookform/resolvers/zod", () => ({
	zodResolver: vi.fn(() => (values: unknown) => ({ values, errors: {} })),
}));
vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/features/professionals", () => ({
	councilTypeOptions: [
		{ value: "CRM", label: "CRM" },
		{ value: "CRO", label: "CRO" },
		{ value: "CRP", label: "CRP" },
	],
	updateCouncilSchema: {},
	useUpdateCouncil: vi.fn(),
}));
vi.mock("@/components/ui/select", () => ({
	Select: ({
		children,
		value,
		onValueChange,
	}: {
		children: React.ReactNode;
		value?: string;
		onValueChange?: (v: string) => void;
	}) => (
		<div data-testid="select" data-value={value}>
			<button type="button" onClick={() => onValueChange?.("CRO")}>
				escolher-cro
			</button>
			{children}
		</div>
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
	SelectItem: ({
		children,
		value,
	}: {
		children: React.ReactNode;
		value: string;
	}) => <div data-value={value}>{children}</div>,
}));

import { CouncilForm } from "@/components/professionals/CouncilForm";
import { CouncilFormFields } from "@/components/professionals/CouncilFormFields";
import { useUpdateCouncil } from "@/features/professionals";

const mockUseUpdateCouncil = vi.mocked(useUpdateCouncil);

beforeEach(() => {
	vi.clearAllMocks();
	mockUseUpdateCouncil.mockReturnValue({
		mutate: vi.fn(),
		isPending: false,
	} as never);
});

type Values = { councilType?: string; councilState?: string };

function FieldsHarness({ defaultValues }: { defaultValues?: Values }) {
	const form = useForm<Values>({ defaultValues });
	return (
		<FormProvider {...form}>
			<CouncilFormFields
				control={form.control as never}
				onSubmit={form.handleSubmit(vi.fn())}
				isPending={false}
			/>
			<span data-testid="council-type-value">{form.watch("councilType")}</span>
		</FormProvider>
	);
}

describe("CouncilFormFields", () => {
	it("renderiza os labels 'Tipo' e 'UF'", () => {
		render(<FieldsHarness />);
		expect(screen.getByText("Tipo")).toBeInTheDocument();
		expect(screen.getByText("UF")).toBeInTheDocument();
	});

	it("renderiza as opções de conselho", () => {
		render(<FieldsHarness />);
		expect(screen.getByText("CRM")).toBeInTheDocument();
		expect(screen.getByText("CRO")).toBeInTheDocument();
		expect(screen.getByText("CRP")).toBeInTheDocument();
	});

	it("propaga a seleção de tipo de conselho para o form pai", async () => {
		render(<FieldsHarness />);
		await userEvent.click(screen.getByText("escolher-cro"));
		expect(screen.getByTestId("council-type-value")).toHaveTextContent("CRO");
	});

	it("renderiza o botão Salvar e reflete isPending", () => {
		render(<FieldsHarness />);
		expect(screen.getByText("Salvar")).toBeInTheDocument();
	});
});

describe("CouncilForm", () => {
	const professional = {
		councilType: "CRM",
		councilState: "SP",
	} as never;

	it("renderiza o título 'Conselho profissional'", () => {
		render(<CouncilForm professional={professional} />);
		expect(screen.getByText("Conselho profissional")).toBeInTheDocument();
	});

	it("exibe o estado inicial vindo do profissional", () => {
		render(<CouncilForm professional={professional} />);
		expect(screen.getByPlaceholderText("SP")).toHaveValue("SP");
	});

	it("chama useUpdateCouncil.mutate ao submeter o formulário", async () => {
		const mutate = vi.fn();
		mockUseUpdateCouncil.mockReturnValue({ mutate, isPending: false } as never);
		render(<CouncilForm professional={professional} />);
		await userEvent.click(screen.getByText("Salvar"));
		expect(mutate).toHaveBeenCalledTimes(1);
	});

	it("exibe 'Salvando...' quando isPending é true", () => {
		mockUseUpdateCouncil.mockReturnValue({
			mutate: vi.fn(),
			isPending: true,
		} as never);
		render(<CouncilForm professional={professional} />);
		expect(screen.getByText("Salvando...")).toBeInTheDocument();
	});
});
