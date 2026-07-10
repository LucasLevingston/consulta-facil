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
	useUpdatePaymentSettings: vi.fn(),
}));

import { toast } from "sonner";
import { useUpdatePaymentSettings } from "@/features/services";
import { PaymentSettingsCard } from "./PaymentSettingsCard";

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
