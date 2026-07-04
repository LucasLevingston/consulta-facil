import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/professionals", () => ({
	useApplicationStatus: vi.fn(),
}));
vi.mock("@/providers/query-boundary", () => ({
	QueryBoundary: ({
		children,
		isLoading,
		error,
	}: {
		children: React.ReactNode;
		isLoading: boolean;
		error: unknown;
	}) =>
		isLoading ? (
			<div data-testid="loading" />
		) : error ? (
			<div data-testid="error">Erro ao carregar dados</div>
		) : (
			<div>{children}</div>
		),
}));
vi.mock("@/components/services/ConsultationPriceCard", () => ({
	ConsultationPriceCard: ({
		consultationPrice,
	}: {
		consultationPrice: number | null;
	}) => <div>ConsultationPriceCard:{String(consultationPrice)}</div>,
}));
vi.mock("@/components/services/PaymentSettingsCard", () => ({
	PaymentSettingsCard: ({
		acceptedPaymentMethods,
		paymentTiming,
	}: {
		acceptedPaymentMethods: string[];
		paymentTiming: string | null;
	}) => (
		<div>
			PaymentSettingsCard:{acceptedPaymentMethods.join(",")}:
			{String(paymentTiming)}
		</div>
	),
}));
vi.mock("@/components/services/ServicesCard", () => ({
	ServicesCard: ({ professionalId }: { professionalId: string }) => (
		<div>ServicesCard:{professionalId}</div>
	),
}));

import { ServicesContent } from "@/components/services/ServicesContent";
import { useApplicationStatus } from "@/features/professionals";

const mockUseApplicationStatus = vi.mocked(useApplicationStatus);

describe("ServicesContent", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("mostra o estado de carregamento", () => {
		mockUseApplicationStatus.mockReturnValue({
			data: undefined,
			isLoading: true,
			error: null,
		} as never);
		render(<ServicesContent />);
		expect(screen.getByTestId("loading")).toBeInTheDocument();
	});

	it("mostra erro ao carregar quando a query falha", () => {
		mockUseApplicationStatus.mockReturnValue({
			data: undefined,
			isLoading: false,
			error: new Error("falhou"),
		} as never);
		render(<ServicesContent />);
		expect(screen.getByTestId("error")).toHaveTextContent(
			"Erro ao carregar dados",
		);
	});

	it("renderiza os três cards repassando os dados do profissional", () => {
		mockUseApplicationStatus.mockReturnValue({
			data: {
				id: "prof-1",
				consultationPrice: 150,
				acceptedPaymentMethods: ["PIX"],
				paymentTiming: "AT_CONSULTATION",
			},
			isLoading: false,
			error: null,
		} as never);
		render(<ServicesContent />);
		expect(screen.getByText("ConsultationPriceCard:150")).toBeInTheDocument();
		expect(
			screen.getByText("PaymentSettingsCard:PIX:AT_CONSULTATION"),
		).toBeInTheDocument();
		expect(screen.getByText("ServicesCard:prof-1")).toBeInTheDocument();
	});

	it("usa string vazia como professionalId quando não há perfil", () => {
		mockUseApplicationStatus.mockReturnValue({
			data: undefined,
			isLoading: false,
			error: null,
		} as never);
		render(<ServicesContent />);
		expect(screen.getByText("ServicesCard:")).toBeInTheDocument();
	});
});
