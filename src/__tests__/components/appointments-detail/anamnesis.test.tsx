import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/anamnesis/AnamnesisAIChat", () => ({
	AnamnesisAIChat: () => <div>mock-anamnesis-ai-chat</div>,
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
	DialogDescription: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}));
vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/components/appointments/detail/use-anamnesis", () => ({
	useAnamnesis: vi.fn(),
}));
vi.mock("@/components/appointments/detail/use-save-anamnesis", () => ({
	useSaveAnamnesis: vi.fn(),
}));

import { toast } from "sonner";
import { AnamnesisAIChatDialog } from "@/components/appointments/detail/AnamnesisAIChatDialog";
import { AnamnesisEditForm } from "@/components/appointments/detail/AnamnesisEditForm";
import { AnamnesisReadView } from "@/components/appointments/detail/AnamnesisReadView";
import { AnamnesisSection } from "@/components/appointments/detail/AnamnesisSection";
import { AnamnesisSectionHeader } from "@/components/appointments/detail/AnamnesisSectionHeader";
import { useAnamnesis } from "@/components/appointments/detail/use-anamnesis";
import { useSaveAnamnesis } from "@/components/appointments/detail/use-save-anamnesis";

describe("AnamnesisAIChatDialog", () => {
	it("renderiza o título e a descrição quando aberto", () => {
		render(
			<AnamnesisAIChatDialog
				open={true}
				onOpenChange={vi.fn()}
				onSave={vi.fn()}
			/>,
		);
		expect(screen.getByText("Preencher anamnese com IA")).toBeInTheDocument();
		expect(screen.getByText("mock-anamnesis-ai-chat")).toBeInTheDocument();
	});

	it("não renderiza conteúdo quando fechado", () => {
		render(
			<AnamnesisAIChatDialog
				open={false}
				onOpenChange={vi.fn()}
				onSave={vi.fn()}
			/>,
		);
		expect(
			screen.queryByText("Preencher anamnese com IA"),
		).not.toBeInTheDocument();
	});
});

describe("AnamnesisEditForm", () => {
	const baseForm = {
		chiefComplaint: "Dor de cabeça",
		currentMedications: "",
		allergies: "",
		medicalHistory: "",
		familyHistory: "",
		observations: "",
	};

	it("renderiza todos os rótulos dos campos", () => {
		render(
			<AnamnesisEditForm
				form={baseForm}
				isPending={false}
				onSave={vi.fn()}
				onCancel={vi.fn()}
				onChange={vi.fn()}
			/>,
		);
		expect(screen.getByText("Queixa principal")).toBeInTheDocument();
		expect(screen.getByText("Medicamentos em uso")).toBeInTheDocument();
		expect(screen.getByText("Alergias")).toBeInTheDocument();
		expect(screen.getByText("Histórico médico")).toBeInTheDocument();
		expect(screen.getByText("Histórico familiar")).toBeInTheDocument();
		expect(screen.getByText("Observações")).toBeInTheDocument();
	});

	it("exibe o valor preenchido do formulário", () => {
		render(
			<AnamnesisEditForm
				form={baseForm}
				isPending={false}
				onSave={vi.fn()}
				onCancel={vi.fn()}
				onChange={vi.fn()}
			/>,
		);
		expect(screen.getByDisplayValue("Dor de cabeça")).toBeInTheDocument();
	});

	it("chama onSave ao clicar em Salvar", async () => {
		const onSave = vi.fn();
		render(
			<AnamnesisEditForm
				form={baseForm}
				isPending={false}
				onSave={onSave}
				onCancel={vi.fn()}
				onChange={vi.fn()}
			/>,
		);
		await userEvent.click(screen.getByText("Salvar"));
		expect(onSave).toHaveBeenCalled();
	});

	it("chama onCancel ao clicar em Cancelar", async () => {
		const onCancel = vi.fn();
		render(
			<AnamnesisEditForm
				form={baseForm}
				isPending={false}
				onSave={vi.fn()}
				onCancel={onCancel}
				onChange={vi.fn()}
			/>,
		);
		await userEvent.click(screen.getByText("Cancelar"));
		expect(onCancel).toHaveBeenCalled();
	});

	it("mostra Salvando... e desabilita o botão quando isPending=true", () => {
		render(
			<AnamnesisEditForm
				form={baseForm}
				isPending={true}
				onSave={vi.fn()}
				onCancel={vi.fn()}
				onChange={vi.fn()}
			/>,
		);
		expect(screen.getByText("Salvando...")).toBeInTheDocument();
		expect(screen.getByText("Salvando...").closest("button")).toBeDisabled();
	});
});

describe("AnamnesisReadView", () => {
	it("mostra mensagem quando não há informações preenchidas", () => {
		render(
			<AnamnesisReadView
				anamnesis={{
					chiefComplaint: undefined,
					currentMedications: undefined,
					allergies: undefined,
					medicalHistory: undefined,
					familyHistory: undefined,
					observations: undefined,
				}}
			/>,
		);
		expect(
			screen.getByText("Sem informações preenchidas."),
		).toBeInTheDocument();
	});

	it("mostra apenas os campos preenchidos", () => {
		render(
			<AnamnesisReadView
				anamnesis={{
					chiefComplaint: "Dor no peito",
					currentMedications: undefined,
					allergies: "Nenhuma",
					medicalHistory: undefined,
					familyHistory: undefined,
					observations: undefined,
				}}
			/>,
		);
		expect(screen.getByText("Queixa principal")).toBeInTheDocument();
		expect(screen.getByText("Dor no peito")).toBeInTheDocument();
		expect(screen.getByText("Alergias")).toBeInTheDocument();
		expect(screen.getByText("Nenhuma")).toBeInTheDocument();
		expect(screen.queryByText("Medicamentos em uso")).not.toBeInTheDocument();
	});
});

describe("AnamnesisSectionHeader", () => {
	it("não mostra botões quando canEdit=false", () => {
		render(
			<AnamnesisSectionHeader
				canEdit={false}
				editing={false}
				showAiHelper={true}
				hasAnamnesis={false}
				onStartEdit={vi.fn()}
				onOpenAi={vi.fn()}
			/>,
		);
		expect(screen.queryByText("Preencher")).not.toBeInTheDocument();
		expect(screen.queryByText("Preencher com IA")).not.toBeInTheDocument();
	});

	it("não mostra botões quando editing=true", () => {
		render(
			<AnamnesisSectionHeader
				canEdit={true}
				editing={true}
				showAiHelper={true}
				hasAnamnesis={false}
				onStartEdit={vi.fn()}
				onOpenAi={vi.fn()}
			/>,
		);
		expect(screen.queryByText("Preencher")).not.toBeInTheDocument();
	});

	it('mostra "Preencher" quando não há anamnese', () => {
		render(
			<AnamnesisSectionHeader
				canEdit={true}
				editing={false}
				showAiHelper={false}
				hasAnamnesis={false}
				onStartEdit={vi.fn()}
				onOpenAi={vi.fn()}
			/>,
		);
		expect(screen.getByText("Preencher")).toBeInTheDocument();
	});

	it('mostra "Editar" quando já há anamnese', () => {
		render(
			<AnamnesisSectionHeader
				canEdit={true}
				editing={false}
				showAiHelper={false}
				hasAnamnesis={true}
				onStartEdit={vi.fn()}
				onOpenAi={vi.fn()}
			/>,
		);
		expect(screen.getByText("Editar")).toBeInTheDocument();
	});

	it("mostra botão de IA quando showAiHelper=true e chama onOpenAi ao clicar", async () => {
		const onOpenAi = vi.fn();
		render(
			<AnamnesisSectionHeader
				canEdit={true}
				editing={false}
				showAiHelper={true}
				hasAnamnesis={false}
				onStartEdit={vi.fn()}
				onOpenAi={onOpenAi}
			/>,
		);
		await userEvent.click(screen.getByText("Preencher com IA"));
		expect(onOpenAi).toHaveBeenCalled();
	});

	it("chama onStartEdit ao clicar em Preencher", async () => {
		const onStartEdit = vi.fn();
		render(
			<AnamnesisSectionHeader
				canEdit={true}
				editing={false}
				showAiHelper={false}
				hasAnamnesis={false}
				onStartEdit={onStartEdit}
				onOpenAi={vi.fn()}
			/>,
		);
		await userEvent.click(screen.getByText("Preencher"));
		expect(onStartEdit).toHaveBeenCalled();
	});
});

describe("AnamnesisSection", () => {
	function setup(opts?: {
		isLoading?: boolean;
		anamnesis?: Record<string, string> | undefined;
		isPending?: boolean;
		save?: ReturnType<typeof vi.fn>;
	}) {
		const save = opts?.save ?? vi.fn().mockResolvedValue(undefined);
		vi.mocked(useAnamnesis).mockReturnValue({
			data: opts?.anamnesis,
			isLoading: opts?.isLoading ?? false,
		} as never);
		vi.mocked(useSaveAnamnesis).mockReturnValue({
			mutateAsync: save,
			isPending: opts?.isPending ?? false,
		} as never);
		return { save };
	}

	it("não renderiza nada enquanto isLoading=true", () => {
		setup({ isLoading: true });
		const { container } = render(
			<AnamnesisSection appointmentId="a-1" canEdit={true} />,
		);
		expect(container.firstChild).toBeNull();
	});

	it("mostra placeholder de edição quando canEdit=true e sem anamnese", () => {
		setup({ anamnesis: undefined });
		render(<AnamnesisSection appointmentId="a-1" canEdit={true} />);
		expect(
			screen.getByText(
				'Nenhuma anamnese preenchida. Clique em "Preencher" para adicionar.',
			),
		).toBeInTheDocument();
	});

	it("mostra placeholder somente leitura quando canEdit=false e sem anamnese", () => {
		setup({ anamnesis: undefined });
		render(<AnamnesisSection appointmentId="a-1" canEdit={false} />);
		expect(screen.getByText("Anamnese não preenchida.")).toBeInTheDocument();
	});

	it("mostra os dados da anamnese em modo leitura", () => {
		setup({ anamnesis: { chiefComplaint: "Febre alta" } });
		render(<AnamnesisSection appointmentId="a-1" canEdit={true} />);
		expect(screen.getByText("Febre alta")).toBeInTheDocument();
	});

	it("entra em modo edição ao clicar em Editar", async () => {
		setup({ anamnesis: { chiefComplaint: "Febre alta" } });
		render(<AnamnesisSection appointmentId="a-1" canEdit={true} />);
		await userEvent.click(screen.getByText("Editar"));
		expect(screen.getByDisplayValue("Febre alta")).toBeInTheDocument();
	});

	it("salva a anamnese e chama a mutation ao clicar em Salvar", async () => {
		const { save } = setup({ anamnesis: { chiefComplaint: "Febre alta" } });
		render(<AnamnesisSection appointmentId="a-1" canEdit={true} />);
		await userEvent.click(screen.getByText("Editar"));
		await userEvent.click(screen.getByText("Salvar"));
		expect(save).toHaveBeenCalled();
		expect(toast.success).toHaveBeenCalledWith("Anamnese salva com sucesso!");
	});

	it("mostra erro quando a mutation de salvar falha", async () => {
		const save = vi.fn().mockRejectedValue(new Error("erro"));
		setup({ anamnesis: { chiefComplaint: "Febre alta" }, save });
		render(<AnamnesisSection appointmentId="a-1" canEdit={true} />);
		await userEvent.click(screen.getByText("Editar"));
		await userEvent.click(screen.getByText("Salvar"));
		expect(toast.error).toHaveBeenCalledWith("Erro ao salvar anamnese.");
	});

	it("abre o dialog de IA ao clicar em Preencher com IA", async () => {
		setup({ anamnesis: undefined });
		render(
			<AnamnesisSection
				appointmentId="a-1"
				canEdit={true}
				showAiHelper={true}
			/>,
		);
		await userEvent.click(screen.getByText("Preencher com IA"));
		expect(screen.getByText("Preencher anamnese com IA")).toBeInTheDocument();
	});
});
