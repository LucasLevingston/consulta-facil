import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/components/appointments/detail/use-prontuario", () => ({
	useProntuario: vi.fn(),
}));
vi.mock("@/components/appointments/detail/use-save-prontuario", () => ({
	useSaveProntuario: vi.fn(),
}));

import { toast } from "sonner";
import { MedicalRecordField } from "@/components/appointments/detail/MedicalRecordField";
import { ProntuarioEditForm } from "@/components/appointments/detail/ProntuarioEditForm";
import { ProntuarioReadView } from "@/components/appointments/detail/ProntuarioReadView";
import { ProntuarioSection } from "@/components/appointments/detail/ProntuarioSection";
import { useProntuario } from "@/components/appointments/detail/use-prontuario";
import { useSaveProntuario } from "@/components/appointments/detail/use-save-prontuario";

describe("MedicalRecordField", () => {
	it("renderiza o rótulo e o valor", () => {
		render(
			<MedicalRecordField
				label="Diagnóstico"
				value="Gripe"
				onChange={vi.fn()}
			/>,
		);
		expect(screen.getByText("Diagnóstico")).toBeInTheDocument();
		expect(screen.getByDisplayValue("Gripe")).toBeInTheDocument();
	});

	it("chama onChange ao digitar", async () => {
		const onChange = vi.fn();
		render(
			<MedicalRecordField label="Diagnóstico" value="" onChange={onChange} />,
		);
		await userEvent.type(screen.getByRole("textbox"), "X");
		expect(onChange).toHaveBeenCalledWith("X");
	});
});

describe("ProntuarioEditForm", () => {
	const baseForm = {
		clinicalNotes: "Paciente estável",
		diagnosis: "",
		diagnosisCid: "",
		prescription: "",
		examRequests: "",
		treatmentPlan: "",
		followUpInstructions: "",
	};

	it("renderiza todos os rótulos dos campos", () => {
		render(
			<ProntuarioEditForm
				form={baseForm}
				isPending={false}
				onSave={vi.fn()}
				onCancel={vi.fn()}
				onChange={vi.fn()}
			/>,
		);
		expect(
			screen.getByText("Anotações clínicas / Exame físico"),
		).toBeInTheDocument();
		expect(screen.getByText("Diagnóstico")).toBeInTheDocument();
		expect(screen.getByText("CID-10")).toBeInTheDocument();
		expect(screen.getByText("Prescrição")).toBeInTheDocument();
		expect(screen.getByText("Solicitações de exame")).toBeInTheDocument();
		expect(screen.getByText("Plano terapêutico")).toBeInTheDocument();
		expect(screen.getByText("Orientações e retorno")).toBeInTheDocument();
	});

	it("exibe o valor preenchido do formulário", () => {
		render(
			<ProntuarioEditForm
				form={baseForm}
				isPending={false}
				onSave={vi.fn()}
				onCancel={vi.fn()}
				onChange={vi.fn()}
			/>,
		);
		expect(screen.getByDisplayValue("Paciente estável")).toBeInTheDocument();
	});

	it("chama onSave ao clicar em Salvar", async () => {
		const onSave = vi.fn();
		render(
			<ProntuarioEditForm
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
			<ProntuarioEditForm
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

	it("mostra Salvando... quando isPending=true", () => {
		render(
			<ProntuarioEditForm
				form={baseForm}
				isPending={true}
				onSave={vi.fn()}
				onCancel={vi.fn()}
				onChange={vi.fn()}
			/>,
		);
		expect(screen.getByText("Salvando...")).toBeInTheDocument();
	});
});

describe("ProntuarioReadView", () => {
	it("mostra mensagem quando não há informações preenchidas", () => {
		render(
			<ProntuarioReadView
				prontuario={{
					clinicalNotes: undefined,
					diagnosis: undefined,
					diagnosisCid: undefined,
					prescription: undefined,
					examRequests: undefined,
					treatmentPlan: undefined,
					followUpInstructions: undefined,
				}}
			/>,
		);
		expect(
			screen.getByText("Sem informações preenchidas."),
		).toBeInTheDocument();
	});

	it("mostra apenas os campos preenchidos", () => {
		render(
			<ProntuarioReadView
				prontuario={{
					clinicalNotes: "Exame normal",
					diagnosis: "Gripe",
					diagnosisCid: undefined,
					prescription: undefined,
					examRequests: undefined,
					treatmentPlan: undefined,
					followUpInstructions: undefined,
				}}
			/>,
		);
		expect(
			screen.getByText("Anotações clínicas / Exame físico"),
		).toBeInTheDocument();
		expect(screen.getByText("Exame normal")).toBeInTheDocument();
		expect(screen.getByText("Diagnóstico")).toBeInTheDocument();
		expect(screen.getByText("Gripe")).toBeInTheDocument();
		expect(screen.queryByText("CID-10")).not.toBeInTheDocument();
	});
});

describe("ProntuarioSection", () => {
	function setup(opts?: {
		isLoading?: boolean;
		prontuario?: Record<string, string> | undefined;
		isPending?: boolean;
		save?: ReturnType<typeof vi.fn>;
	}) {
		const save = opts?.save ?? vi.fn().mockResolvedValue(undefined);
		vi.mocked(useProntuario).mockReturnValue({
			data: opts?.prontuario,
			isLoading: opts?.isLoading ?? false,
		} as never);
		vi.mocked(useSaveProntuario).mockReturnValue({
			mutateAsync: save,
			isPending: opts?.isPending ?? false,
		} as never);
		return { save };
	}

	it("não renderiza nada enquanto isLoading=true", () => {
		setup({ isLoading: true });
		const { container } = render(
			<ProntuarioSection appointmentId="a-1" canEdit={true} />,
		);
		expect(container.firstChild).toBeNull();
	});

	it("mostra placeholder de edição quando canEdit=true e sem prontuário", () => {
		setup({ prontuario: undefined });
		render(<ProntuarioSection appointmentId="a-1" canEdit={true} />);
		expect(
			screen.getByText(
				'Prontuário não preenchido. Clique em "Preencher" para adicionar.',
			),
		).toBeInTheDocument();
	});

	it("mostra placeholder somente leitura quando canEdit=false e sem prontuário", () => {
		setup({ prontuario: undefined });
		render(<ProntuarioSection appointmentId="a-1" canEdit={false} />);
		expect(screen.getByText("Prontuário não disponível.")).toBeInTheDocument();
	});

	it("mostra os dados do prontuário em modo leitura", () => {
		setup({ prontuario: { diagnosis: "Gripe forte" } });
		render(<ProntuarioSection appointmentId="a-1" canEdit={true} />);
		expect(screen.getByText("Gripe forte")).toBeInTheDocument();
	});

	it("entra em modo edição ao clicar em Editar", async () => {
		setup({ prontuario: { diagnosis: "Gripe forte" } });
		render(<ProntuarioSection appointmentId="a-1" canEdit={true} />);
		await userEvent.click(screen.getByText("Editar"));
		expect(screen.getByDisplayValue("Gripe forte")).toBeInTheDocument();
	});

	it("salva o prontuário e chama a mutation ao clicar em Salvar", async () => {
		const { save } = setup({ prontuario: { diagnosis: "Gripe forte" } });
		render(<ProntuarioSection appointmentId="a-1" canEdit={true} />);
		await userEvent.click(screen.getByText("Editar"));
		await userEvent.click(screen.getByText("Salvar"));
		expect(save).toHaveBeenCalled();
		expect(toast.success).toHaveBeenCalledWith("Prontuário salvo com sucesso!");
	});

	it("mostra erro quando a mutation de salvar falha", async () => {
		const save = vi.fn().mockRejectedValue(new Error("erro"));
		setup({ prontuario: { diagnosis: "Gripe forte" }, save });
		render(<ProntuarioSection appointmentId="a-1" canEdit={true} />);
		await userEvent.click(screen.getByText("Editar"));
		await userEvent.click(screen.getByText("Salvar"));
		expect(toast.error).toHaveBeenCalledWith("Erro ao salvar prontuário.");
	});
});
