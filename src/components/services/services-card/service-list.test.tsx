import { render, screen } from "@testing-library/react";
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
vi.mock("./use-deactivate-service", () => ({
	useDeactivateService: vi.fn(),
}));
vi.mock("./use-get-professional-services", () => ({
	useGetProfessionalServices: vi.fn(),
}));
vi.mock("./use-create-service", () => ({
	useCreateService: vi.fn(),
}));
vi.mock("./use-update-service", () => ({
	useUpdateService: vi.fn(),
}));

import { toast } from "sonner";
import { ServiceRow } from "./ServiceRow";
import { ServicesCard } from "./ServicesCard";
import { useCreateService } from "./use-create-service";
import { useDeactivateService } from "./use-deactivate-service";
import { useGetProfessionalServices } from "./use-get-professional-services";
import { useUpdateService } from "./use-update-service";

const mockUseDeactivateService = vi.mocked(useDeactivateService);
const mockUseGetProfessionalServices = vi.mocked(useGetProfessionalServices);
const mockUseCreateService = vi.mocked(useCreateService);
const mockUseUpdateService = vi.mocked(useUpdateService);

const baseService: ProfessionalService = {
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

describe("ServiceRow", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseDeactivateService.mockReturnValue({
			mutateAsync: vi.fn().mockResolvedValue({}),
			isPending: false,
		} as never);
	});

	it("renderiza nome, preço formatado e duração", () => {
		render(<ServiceRow service={baseService} onEdit={vi.fn()} />);
		expect(screen.getByText("Ultrassom")).toBeInTheDocument();
		expect(screen.getByText("R$ 200.00")).toBeInTheDocument();
		expect(screen.getByText("45 min")).toBeInTheDocument();
	});

	it("renderiza o badge Requer consulta quando requiresConsultation=true", () => {
		render(<ServiceRow service={baseService} onEdit={vi.fn()} />);
		expect(screen.getByText("Requer consulta")).toBeInTheDocument();
	});

	it("não renderiza o badge quando requiresConsultation=false", () => {
		render(
			<ServiceRow
				service={{ ...baseService, requiresConsultation: false }}
				onEdit={vi.fn()}
			/>,
		);
		expect(screen.queryByText("Requer consulta")).not.toBeInTheDocument();
	});

	it("não renderiza descrição quando ausente", () => {
		render(
			<ServiceRow
				service={{ ...baseService, description: null }}
				onEdit={vi.fn()}
			/>,
		);
		expect(screen.queryByText("Exame de imagem")).not.toBeInTheDocument();
	});

	it("botão editar chama onEdit", async () => {
		const onEdit = vi.fn();
		render(<ServiceRow service={baseService} onEdit={onEdit} />);
		const buttons = screen.getAllByRole("button");
		await userEvent.click(buttons[0]);
		expect(onEdit).toHaveBeenCalled();
	});

	it("botão excluir chama a mutation de desativar com o id do serviço", async () => {
		const deactivate = vi.fn().mockResolvedValue({});
		mockUseDeactivateService.mockReturnValue({
			mutateAsync: deactivate,
			isPending: false,
		} as never);
		render(<ServiceRow service={baseService} onEdit={vi.fn()} />);
		const buttons = screen.getAllByRole("button");
		await userEvent.click(buttons[1]);
		expect(deactivate).toHaveBeenCalledWith("s-1");
		expect(toast.success).toHaveBeenCalledWith("Serviço removido.");
	});

	it("mostra erro quando a desativação falha", async () => {
		const deactivate = vi.fn().mockRejectedValue(new Error("erro"));
		mockUseDeactivateService.mockReturnValue({
			mutateAsync: deactivate,
			isPending: false,
		} as never);
		render(<ServiceRow service={baseService} onEdit={vi.fn()} />);
		const buttons = screen.getAllByRole("button");
		await userEvent.click(buttons[1]);
		expect(toast.error).toHaveBeenCalledWith("Erro ao remover serviço.");
	});

	it("desabilita o botão excluir quando isPending=true", () => {
		mockUseDeactivateService.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: true,
		} as never);
		render(<ServiceRow service={baseService} onEdit={vi.fn()} />);
		const buttons = screen.getAllByRole("button");
		expect(buttons[1]).toBeDisabled();
	});
});

describe("ServicesCard", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseCreateService.mockReturnValue({
			mutateAsync: vi.fn().mockResolvedValue({}),
			isPending: false,
		} as never);
		mockUseUpdateService.mockReturnValue({
			mutateAsync: vi.fn().mockResolvedValue({}),
			isPending: false,
		} as never);
		mockUseDeactivateService.mockReturnValue({
			mutateAsync: vi.fn().mockResolvedValue({}),
			isPending: false,
		} as never);
	});

	it("mostra Carregando... enquanto isLoading=true", () => {
		mockUseGetProfessionalServices.mockReturnValue({
			data: undefined,
			isLoading: true,
		} as never);
		render(<ServicesCard professionalId="p-1" />);
		expect(screen.getByText("Carregando...")).toBeInTheDocument();
	});

	it("mostra mensagem de lista vazia quando não há serviços", () => {
		mockUseGetProfessionalServices.mockReturnValue({
			data: [],
			isLoading: false,
		} as never);
		render(<ServicesCard professionalId="p-1" />);
		expect(
			screen.getByText("Nenhum serviço cadastrado ainda."),
		).toBeInTheDocument();
	});

	it("renderiza uma linha por serviço da lista", () => {
		mockUseGetProfessionalServices.mockReturnValue({
			data: [
				baseService,
				{ ...baseService, id: "s-2", name: "Consulta Geral" },
			],
			isLoading: false,
		} as never);
		render(<ServicesCard professionalId="p-1" />);
		expect(screen.getByText("Ultrassom")).toBeInTheDocument();
		expect(screen.getByText("Consulta Geral")).toBeInTheDocument();
	});

	it("renderiza o botão Novo serviço", () => {
		mockUseGetProfessionalServices.mockReturnValue({
			data: [],
			isLoading: false,
		} as never);
		render(<ServicesCard professionalId="p-1" />);
		expect(
			screen.getByRole("button", { name: /Novo serviço/ }),
		).toBeInTheDocument();
	});

	it("abre o dialog de edição preenchido ao clicar em editar em uma linha", async () => {
		mockUseGetProfessionalServices.mockReturnValue({
			data: [baseService],
			isLoading: false,
		} as never);
		render(<ServicesCard professionalId="p-1" />);
		// botões na ordem: Novo serviço, editar (linha), excluir (linha)
		const buttons = screen.getAllByRole("button");
		await userEvent.click(buttons[1]);
		expect(await screen.findByText("Editar serviço")).toBeInTheDocument();
		expect(screen.getByLabelText("Nome *")).toHaveValue("Ultrassom");
	});
});
