import { render, screen } from "@testing-library/react";
import Cookies from "js-cookie";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockReplace = vi.fn();
const mockGet = vi.fn();

vi.mock("next/navigation", () => ({
	useRouter: () => ({ replace: mockReplace }),
	useSearchParams: () => ({ get: mockGet }),
}));
vi.mock("js-cookie", () => ({
	default: { set: vi.fn(), remove: vi.fn() },
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const mockSetAuth = vi.fn();
vi.mock("@/features/auth", () => ({
	useAuthStore: (
		selector: (state: { setAuth: typeof mockSetAuth }) => unknown,
	) => selector({ setAuth: mockSetAuth }),
}));

import { toast } from "sonner";
import GoogleCallbackContent from "@/components/auth/GoogleCallbackContent";

describe("GoogleCallbackContent", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renderiza o estado de autenticando", () => {
		mockGet.mockReturnValue("um-token-valido");
		render(<GoogleCallbackContent />);
		expect(screen.getByText("Autenticando...")).toBeInTheDocument();
		expect(screen.getByText("Aguarde um momento.")).toBeInTheDocument();
	});

	it("quando há token: seta auth, salva cookie e redireciona para o dashboard", () => {
		mockGet.mockReturnValue("um-token-valido");
		render(<GoogleCallbackContent />);
		expect(mockSetAuth).toHaveBeenCalledWith("um-token-valido");
		expect(Cookies.set).toHaveBeenCalledWith(
			"auth_token",
			"um-token-valido",
			expect.objectContaining({ expires: 1 }),
		);
		expect(toast.success).toHaveBeenCalledWith(
			"Login com Google feito com sucesso!",
		);
		expect(mockReplace).toHaveBeenCalledWith("/dashboard");
	});

	it("quando não há token: mostra erro e redireciona para o login", () => {
		mockGet.mockReturnValue(null);
		render(<GoogleCallbackContent />);
		expect(toast.error).toHaveBeenCalledWith("Erro ao entrar com Google.");
		expect(mockReplace).toHaveBeenCalledWith("/auth/login");
		expect(mockSetAuth).not.toHaveBeenCalled();
	});
});
