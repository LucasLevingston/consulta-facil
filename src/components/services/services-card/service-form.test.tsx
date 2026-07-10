import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ProfessionalService } from "@/features/services";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/components/ui/checkbox", () => ({
	Checkbox: ({
		checked,
		onCheckedChange,
		...props
	}: {
		checked?: boolean;
		onCheckedChange?: (v: boolean) => void;
	} & Record<string, unknown>) => (
		<input
			type="checkbox"
			checked={!!checked}
			onChange={(e) => onCheckedChange?.(e.target.checked)}
			{...props}
		/>
	),
}));
vi.mock("@/features/services", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/features/services")>();
	return {
		...actual,
		useCreateService: vi.fn(),
		useUpdateService: vi.fn(),
	};
});

import { toast } from "sonner";
import { useCreateService, useUpdateService } from "@/features/services";
import { ServiceForm } from "./ServiceForm";

const mockUseCreateService = vi.mocked(useCreateService);
const mockUseUpdateService = vi.mocked(useUpdateService);

const existingService: ProfessionalService = {
	id: "s-1",
	professionalId: "p-1",
	professionalName: null,
	name: "Ultrassom",
	description: "Exame de imagem",
	price: 200,
	durationMinutes: 45,
	requiresConsultation: true,
	active: true,
	createdAt: null,
	updatedAt: null,
};

describe("ServiceForm", () => {
	let createMutateAsync = vi.fn();
	let updateMutateAsync = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		createMutateAsync = vi.fn().mockResolvedValue({});
		updateMutateAsync = vi.fn().mockResolvedValue({});
		mockUseCreateService.mockReturnValue({
			mutateAsync: createMutateAsync,
			isPending: false,
		} as never);
		mockUseUpdateService.mockReturnValue({
			mutateAsync: updateMutateAsync,
			isPending: false,
		} as never);
	});

	it("modo criação: renderiza campos vazios e botão Criar serviço", () => {
		render(<ServiceForm onClose={vi.fn()} />);
		expect(screen.getByLabelText("Nome *")).toHaveValue("");
		expect(screen.getByText("Criar serviço")).toBeInTheDocument();
	});

	it("modo edição: preenche os campos com os valores existentes e mostra Atualizar", () => {
		render(<ServiceForm existing={existingService} onClose={vi.fn()} />);
		expect(screen.getByLabelText("Nome *")).toHaveValue("Ultrassom");
		expect(screen.getByLabelText("Descrição")).toHaveValue("Exame de imagem");
		expect(screen.getByLabelText("Preço (R$) *")).toHaveValue(200);
		expect(screen.getByLabelText("Duração (min) *")).toHaveValue(45);
		expect(screen.getByRole("checkbox")).toBeChecked();
		expect(screen.getByText("Atualizar")).toBeInTheDocument();
	});

	it("botão Cancelar chama onClose sem submeter", async () => {
		const onClose = vi.fn();
		render(<ServiceForm onClose={onClose} />);
		await userEvent.click(screen.getByText("Cancelar"));
		expect(onClose).toHaveBeenCalled();
		expect(createMutateAsync).not.toHaveBeenCalled();
	});

	it("não submete e mostra erro quando o nome é inválido", async () => {
		render(<ServiceForm onClose={vi.fn()} />);
		await userEvent.click(screen.getByText("Criar serviço"));
		expect(
			await screen.findByText("Nome deve ter ao menos 2 caracteres"),
		).toBeInTheDocument();
	});

	it("preenche e submete criando um novo serviço", async () => {
		const onClose = vi.fn();
		render(<ServiceForm onClose={onClose} />);

		await userEvent.type(screen.getByLabelText("Nome *"), "Limpeza de pele");
		const priceInput = screen.getByLabelText("Preço (R$) *");
		await userEvent.clear(priceInput);
		await userEvent.type(priceInput, "150");

		await userEvent.click(screen.getByText("Criar serviço"));

		await waitFor(() =>
			expect(createMutateAsync).toHaveBeenCalledWith({
				name: "Limpeza de pele",
				description: "",
				price: 150,
				durationMinutes: 30,
				requiresConsultation: false,
			}),
		);
		expect(toast.success).toHaveBeenCalledWith("Serviço criado!");
		expect(onClose).toHaveBeenCalled();
	});

	it("submete atualização chamando useUpdateService com serviceId e dados", async () => {
		const onClose = vi.fn();
		render(<ServiceForm existing={existingService} onClose={onClose} />);

		await userEvent.click(screen.getByText("Atualizar"));

		await waitFor(() =>
			expect(updateMutateAsync).toHaveBeenCalledWith({
				serviceId: "s-1",
				data: {
					name: "Ultrassom",
					description: "Exame de imagem",
					price: 200,
					durationMinutes: 45,
					requiresConsultation: true,
				},
			}),
		);
		expect(toast.success).toHaveBeenCalledWith("Serviço atualizado!");
		expect(onClose).toHaveBeenCalled();
	});
});
