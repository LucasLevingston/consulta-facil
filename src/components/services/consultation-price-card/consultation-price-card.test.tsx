import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/features/services", () => ({
	useSetConsultationPrice: vi.fn(),
}));

import { toast } from "sonner";
import { useSetConsultationPrice } from "@/features/services";
import { ConsultationPriceCard } from "./ConsultationPriceCard";

const mockUseSetConsultationPrice = vi.mocked(useSetConsultationPrice);

describe("ConsultationPriceCard", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseSetConsultationPrice.mockReturnValue({
			mutateAsync: vi.fn().mockResolvedValue({}),
			isPending: false,
		} as never);
	});

	it("renderiza o título e o valor inicial do preço", () => {
		render(<ConsultationPriceCard consultationPrice={200} />);
		expect(screen.getByText("Preço da Consulta")).toBeInTheDocument();
		expect(screen.getByLabelText("Valor (R$)")).toHaveValue(200);
	});

	it("renderiza input vazio quando não há preço definido", () => {
		render(<ConsultationPriceCard consultationPrice={null} />);
		expect(screen.getByLabelText("Valor (R$)")).toHaveValue(null);
	});

	it("exibe erro e não chama a mutation para valor inválido", async () => {
		const mutateAsync = vi.fn();
		mockUseSetConsultationPrice.mockReturnValue({
			mutateAsync,
			isPending: false,
		} as never);
		render(<ConsultationPriceCard consultationPrice={null} />);
		await userEvent.click(screen.getByText("Salvar"));
		expect(toast.error).toHaveBeenCalledWith("Informe um valor válido.");
		expect(mutateAsync).not.toHaveBeenCalled();
	});

	it("chama a mutation com o valor numérico ao salvar um preço válido", async () => {
		const mutateAsync = vi.fn().mockResolvedValue({});
		mockUseSetConsultationPrice.mockReturnValue({
			mutateAsync,
			isPending: false,
		} as never);
		render(<ConsultationPriceCard consultationPrice={null} />);
		const input = screen.getByLabelText("Valor (R$)");
		await userEvent.type(input, "150.50");
		await userEvent.click(screen.getByText("Salvar"));
		expect(mutateAsync).toHaveBeenCalledWith(150.5);
		expect(toast.success).toHaveBeenCalled();
	});

	it("desabilita o botão e mostra Salvando... quando isPending=true", () => {
		mockUseSetConsultationPrice.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: true,
		} as never);
		render(<ConsultationPriceCard consultationPrice={100} />);
		expect(screen.getByText("Salvando...")).toBeInTheDocument();
		expect(screen.getByText("Salvando...").closest("button")).toBeDisabled();
	});
});
