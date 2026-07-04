import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/appointments", () => ({
	useCheckInByQr: vi.fn(),
}));
vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));

import { toast } from "sonner";
import { CheckInPanel } from "@/components/reception/CheckInPanel";
import { useCheckInByQr } from "@/features/appointments";

const mockUseCheckInByQr = vi.mocked(useCheckInByQr);

describe("CheckInPanel", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renderiza o título do painel de check-in", () => {
		mockUseCheckInByQr.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: false,
		} as never);
		render(<CheckInPanel />);
		expect(screen.getByText("Check-in por QR Code")).toBeInTheDocument();
	});

	it("mantém o botão de check-in desabilitado quando o token está vazio", () => {
		mockUseCheckInByQr.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: false,
		} as never);
		render(<CheckInPanel />);
		expect(screen.getByText("Check-in")).toBeDisabled();
	});

	it("chama checkIn com o token informado e exibe sucesso", async () => {
		const mutateAsync = vi.fn().mockResolvedValue({ patientName: "Ana Silva" });
		mockUseCheckInByQr.mockReturnValue({
			mutateAsync,
			isPending: false,
		} as never);
		render(<CheckInPanel />);

		const input = screen.getByPlaceholderText("Token do QR Code...");
		await userEvent.type(input, "token-abc-123");
		await userEvent.click(screen.getByText("Check-in"));

		expect(mutateAsync).toHaveBeenCalledWith("token-abc-123");
		expect(toast.success).toHaveBeenCalledWith("Check-in realizado: Ana Silva");
	});

	it("exibe erro quando o token é inválido", async () => {
		const mutateAsync = vi.fn().mockRejectedValue(new Error("inválido"));
		mockUseCheckInByQr.mockReturnValue({
			mutateAsync,
			isPending: false,
		} as never);
		render(<CheckInPanel />);

		const input = screen.getByPlaceholderText("Token do QR Code...");
		await userEvent.type(input, "token-invalido");
		await userEvent.click(screen.getByText("Check-in"));

		expect(toast.error).toHaveBeenCalledWith("Token inválido ou expirado.");
	});

	it("limpa o campo de token após check-in bem-sucedido", async () => {
		const mutateAsync = vi.fn().mockResolvedValue({ patientName: "Ana Silva" });
		mockUseCheckInByQr.mockReturnValue({
			mutateAsync,
			isPending: false,
		} as never);
		render(<CheckInPanel />);

		const input = screen.getByPlaceholderText(
			"Token do QR Code...",
		) as HTMLInputElement;
		await userEvent.type(input, "token-abc-123");
		await userEvent.click(screen.getByText("Check-in"));

		expect(input.value).toBe("");
	});
});
