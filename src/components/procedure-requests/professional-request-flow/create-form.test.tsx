import { zodResolver } from "@hookform/resolvers/zod";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

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
		<select
			aria-label="select"
			value={value ?? ""}
			onChange={(e) => onValueChange?.(e.target.value)}
		>
			<option value="" />
			{children}
		</select>
	),
	SelectTrigger: () => null,
	SelectValue: () => null,
	SelectContent: ({ children }: { children: React.ReactNode }) => (
		<>{children}</>
	),
	SelectItem: ({
		children,
		value,
		disabled,
	}: {
		children: React.ReactNode;
		value: string;
		disabled?: boolean;
	}) => (
		<option value={value} disabled={disabled}>
			{children}
		</option>
	),
}));

const { createMutateAsync, toastSuccess, toastError } = vi.hoisted(() => ({
	createMutateAsync: vi.fn(),
	toastSuccess: vi.fn(),
	toastError: vi.fn(),
}));

vi.mock("sonner", () => ({
	toast: { success: toastSuccess, error: toastError },
}));
vi.mock("@/features/patients", () => ({
	useProfessionalPatients: vi.fn(),
}));
vi.mock(
	"@/components/services/services-card/use-get-professional-services",
	() => ({
		useGetProfessionalServices: vi.fn(),
	}),
);
vi.mock("@/features/procedure-requests", async () => {
	const { z: zodLib } = await import("zod");
	return {
		createProcedureRequestSchema: zodLib.object({
			serviceId: zodLib.string().min(1, "Serviço é obrigatório"),
			patientId: zodLib.string().min(1, "Paciente é obrigatório"),
			notes: zodLib.string().optional(),
		}),
	};
});
vi.mock("./use-create-procedure-request", () => ({
	useCreateProcedureRequest: vi.fn(() => ({
		mutateAsync: createMutateAsync,
		isPending: false,
	})),
}));

import { useGetProfessionalServices } from "@/components/services/services-card/use-get-professional-services";
import { useProfessionalPatients } from "@/features/patients";
import type { CreateProcedureRequestInput } from "@/features/procedure-requests";
import { CreateProcedureRequestForm } from "./CreateProcedureRequestForm";
import { CreateProcedureRequestFormFields } from "./CreateProcedureRequestFormFields";
import { useCreateProcedureRequest } from "./use-create-procedure-request";

const services = [{ id: "s-1", name: "Consulta Geral", price: 100 }];

function FormFieldsWrapper({
	servicesList = services,
	patientsList = [],
	isPending = false,
	onClose = vi.fn(),
	onSubmit = vi.fn(),
}: {
	servicesList?: typeof services;
	patientsList?: { id: string; name: string }[];
	isPending?: boolean;
	onClose?: () => void;
	onSubmit?: (values: CreateProcedureRequestInput) => void;
}) {
	const form = useForm<CreateProcedureRequestInput>({
		resolver: zodResolver(
			z.object({
				serviceId: z.string().min(1, "Serviço é obrigatório"),
				patientId: z.string().min(1, "Paciente é obrigatório"),
				notes: z.string().optional(),
			}),
		),
		defaultValues: { serviceId: "", patientId: "", notes: "" },
	});
	return (
		<CreateProcedureRequestFormFields
			form={form}
			services={servicesList}
			patients={patientsList}
			isPending={isPending}
			onClose={onClose}
			onSubmit={form.handleSubmit(onSubmit)}
		/>
	);
}

describe("CreateProcedureRequestFormFields", () => {
	it("renderiza labels de Serviço, Paciente e Observações", () => {
		render(<FormFieldsWrapper />);
		expect(screen.getByText("Serviço *")).toBeInTheDocument();
		expect(screen.getByText("Paciente *")).toBeInTheDocument();
		expect(screen.getByText("Observações")).toBeInTheDocument();
	});

	it("exibe mensagem quando nenhum serviço exige consulta prévia", () => {
		render(<FormFieldsWrapper servicesList={[]} />);
		expect(
			screen.getByText("Nenhum serviço requer consulta prévia"),
		).toBeInTheDocument();
	});

	it("exibe erro de serviço obrigatório ao submeter vazio", async () => {
		const onSubmit = vi.fn();
		render(<FormFieldsWrapper onSubmit={onSubmit} />);
		await userEvent.click(screen.getByText("Criar solicitação"));
		expect(
			await screen.findByText("Serviço é obrigatório"),
		).toBeInTheDocument();
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("chama onClose ao clicar em Cancelar", async () => {
		const onClose = vi.fn();
		render(<FormFieldsWrapper onClose={onClose} />);
		await userEvent.click(screen.getByText("Cancelar"));
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("desabilita o botão de submit e mostra 'Criando...' quando isPending=true", () => {
		render(<FormFieldsWrapper isPending={true} />);
		expect(screen.getByText("Criando...")).toBeDisabled();
	});
});

describe("CreateProcedureRequestForm", () => {
	beforeEach(() => {
		createMutateAsync.mockReset();
		toastSuccess.mockReset();
		toastError.mockReset();
		vi.mocked(useGetProfessionalServices).mockReturnValue({
			data: [
				{
					id: "s-1",
					name: "Consulta com avaliação",
					price: 200,
					requiresConsultation: true,
				},
				{
					id: "s-2",
					name: "Exame simples",
					price: 50,
					requiresConsultation: false,
				},
			],
		} as never);
		vi.mocked(useProfessionalPatients).mockReturnValue({
			data: { content: [] },
		} as never);
		vi.mocked(useCreateProcedureRequest).mockReturnValue({
			mutateAsync: createMutateAsync,
			isPending: false,
		} as never);
	});

	it("filtra e exibe somente serviços que exigem consulta prévia", () => {
		render(
			<CreateProcedureRequestForm professionalId="prof-1" onClose={vi.fn()} />,
		);
		expect(screen.getByText(/Consulta com avaliação/)).toBeInTheDocument();
		expect(screen.queryByText(/Exame simples/)).not.toBeInTheDocument();
	});

	it("envia o formulário e chama a mutation de criação com os dados corretos", async () => {
		createMutateAsync.mockResolvedValueOnce(undefined);
		const onClose = vi.fn();
		render(
			<CreateProcedureRequestForm professionalId="prof-1" onClose={onClose} />,
		);

		await userEvent.selectOptions(screen.getByRole("combobox"), "s-1");
		await userEvent.type(
			screen.getByPlaceholderText("ID do paciente"),
			"pat-1",
		);
		await userEvent.click(screen.getByText("Criar solicitação"));

		expect(createMutateAsync).toHaveBeenCalledWith({
			serviceId: "s-1",
			patientId: "pat-1",
			notes: "",
		});
		expect(toastSuccess).toHaveBeenCalledWith("Solicitação criada!");
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("mostra toast de erro quando a criação falha", async () => {
		createMutateAsync.mockRejectedValueOnce(new Error("falha"));
		render(
			<CreateProcedureRequestForm professionalId="prof-1" onClose={vi.fn()} />,
		);

		await userEvent.selectOptions(screen.getByRole("combobox"), "s-1");
		await userEvent.type(
			screen.getByPlaceholderText("ID do paciente"),
			"pat-1",
		);
		await userEvent.click(screen.getByText("Criar solicitação"));

		await waitFor(() => {
			expect(toastError).toHaveBeenCalledWith("Erro ao criar solicitação.");
		});
	});
});
