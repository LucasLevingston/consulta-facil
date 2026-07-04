import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

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
vi.mock("@/features/services", () => ({
	useSetConsultationPrice: vi.fn(),
	useUpdatePaymentSettings: vi.fn(),
}));

import { toast } from "sonner";
import { ConsultationPriceCard } from "@/components/services/ConsultationPriceCard";
import { PaymentSettingsCard } from "@/components/services/PaymentSettingsCard";
import {
	useSetConsultationPrice,
	useUpdatePaymentSettings,
} from "@/features/services";

const mockUseSetConsultationPrice = vi.mocked(useSetConsultationPrice);
const mockUseUpdatePaymentSettings = vi.mocked(useUpdatePaymentSettings);

describe("PaymentSettingsCard", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseUpdatePaymentSettings.mockReturnValue({
			mutateAsync: vi.fn().mockResolvedValue({}),
			isPending: false,
		} as never);
	});

	it("renderiza o título e os campos de pagamento", () => {
		render(
			<PaymentSettingsCard acceptedPaymentMethods={[]} paymentTiming={null} />,
		);
		expect(screen.getByText("Configurações de Pagamento")).toBeInTheDocument();
		expect(screen.getByText("Momento do pagamento")).toBeInTheDocument();
		expect(screen.getByText("Métodos aceitos")).toBeInTheDocument();
	});

	it("botão Salvar configurações inicia desabilitado (form não sujo)", () => {
		render(
			<PaymentSettingsCard
				acceptedPaymentMethods={["PIX"]}
				paymentTiming="AT_CONSULTATION"
			/>,
		);
		expect(
			screen.getByText("Salvar configurações").closest("button"),
		).toBeDisabled();
	});

	it("submete as configurações alteradas chamando a mutation correta", async () => {
		const mutateAsync = vi.fn().mockResolvedValue({});
		mockUseUpdatePaymentSettings.mockReturnValue({
			mutateAsync,
			isPending: false,
		} as never);
		render(
			<PaymentSettingsCard
				acceptedPaymentMethods={["PIX"]}
				paymentTiming="AT_CONSULTATION"
			/>,
		);
		await userEvent.click(screen.getByText("No agendamento"));
		const saveButton = screen
			.getByText("Salvar configurações")
			.closest("button") as HTMLButtonElement;
		expect(saveButton).not.toBeDisabled();
		await userEvent.click(saveButton);
		expect(mutateAsync).toHaveBeenCalledWith({
			paymentTiming: "AT_SCHEDULING",
			acceptedPaymentMethods: ["PIX"],
		});
		expect(toast.success).toHaveBeenCalled();
	});
});

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
