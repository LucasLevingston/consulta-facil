import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockPush = vi.fn();
const mockGet = vi.fn();

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: mockPush }),
	useSearchParams: () => ({ get: mockGet }),
}));
vi.mock("next/link", () => ({
	default: ({
		href,
		children,
	}: {
		href: string;
		children: React.ReactNode;
	}) => <a href={href}>{children}</a>,
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const mockResetPasswordMutateAsync = vi.fn();

vi.mock("@/features/auth", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/features/auth")>();
	return {
		...actual,
		useResetPassword: vi.fn(() => ({
			mutateAsync: mockResetPasswordMutateAsync,
			isPending: false,
		})),
	};
});

import { toast } from "sonner";
import { ResetPasswordContent } from "@/components/auth/reset-password/ResetPasswordContent";
import { ResetPasswordInvalidLink } from "@/components/auth/reset-password/ResetPasswordInvalidLink";
import { ResetPasswordSuccessView } from "@/components/auth/reset-password/ResetPasswordSuccessView";

describe("ResetPasswordInvalidLink", () => {
	it("renderiza a mensagem de link inválido e o atalho para solicitar novo link", () => {
		render(<ResetPasswordInvalidLink />);
		expect(screen.getByText("Link inválido")).toBeInTheDocument();
		expect(
			screen.getByText("Este link de redefinição é inválido ou expirou."),
		).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: "Solicitar novo link" }),
		).toHaveAttribute("href", "/auth/forgot-password");
	});
});

describe("ResetPasswordSuccessView", () => {
	it("renderiza a mensagem de sucesso", () => {
		render(<ResetPasswordSuccessView onGoToLogin={vi.fn()} />);
		expect(screen.getByText("Senha redefinida!")).toBeInTheDocument();
		expect(
			screen.getByText("Sua senha foi alterada com sucesso."),
		).toBeInTheDocument();
	});

	it("chama onGoToLogin ao clicar no botão", async () => {
		const user = userEvent.setup();
		const onGoToLogin = vi.fn();
		render(<ResetPasswordSuccessView onGoToLogin={onGoToLogin} />);
		await user.click(screen.getByRole("button", { name: "Ir para o login" }));
		expect(onGoToLogin).toHaveBeenCalledTimes(1);
	});
});

describe("ResetPasswordContent", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("mostra o link inválido quando não há token na URL", () => {
		mockGet.mockReturnValue(null);
		render(<ResetPasswordContent />);
		expect(screen.getByText("Link inválido")).toBeInTheDocument();
	});

	it("renderiza o formulário de nova senha quando há token válido", () => {
		mockGet.mockReturnValue("token-valido");
		render(<ResetPasswordContent />);
		expect(screen.getByText("Criar nova senha")).toBeInTheDocument();
		expect(screen.getByText("Nova senha")).toBeInTheDocument();
		expect(screen.getByText("Confirmar senha")).toBeInTheDocument();
	});

	it("submete a nova senha e mostra a tela de sucesso", async () => {
		const user = userEvent.setup();
		mockGet.mockReturnValue("token-valido");
		mockResetPasswordMutateAsync.mockResolvedValueOnce(undefined);
		render(<ResetPasswordContent />);

		await user.type(
			screen.getByPlaceholderText("Mínimo 8 caracteres"),
			"novaSenha123",
		);
		await user.type(
			screen.getByPlaceholderText("Repita a nova senha"),
			"novaSenha123",
		);
		await user.click(screen.getByRole("button", { name: "Redefinir senha" }));

		await waitFor(() =>
			expect(mockResetPasswordMutateAsync).toHaveBeenCalledWith({
				token: "token-valido",
				newPassword: "novaSenha123",
			}),
		);
		expect(screen.getByText("Senha redefinida!")).toBeInTheDocument();
	});

	it("navega para o login ao clicar em 'Ir para o login' após o sucesso", async () => {
		const user = userEvent.setup();
		mockGet.mockReturnValue("token-valido");
		mockResetPasswordMutateAsync.mockResolvedValueOnce(undefined);
		render(<ResetPasswordContent />);

		await user.type(
			screen.getByPlaceholderText("Mínimo 8 caracteres"),
			"novaSenha123",
		);
		await user.type(
			screen.getByPlaceholderText("Repita a nova senha"),
			"novaSenha123",
		);
		await user.click(screen.getByRole("button", { name: "Redefinir senha" }));
		await waitFor(() =>
			expect(screen.getByText("Senha redefinida!")).toBeInTheDocument(),
		);

		await user.click(screen.getByRole("button", { name: "Ir para o login" }));
		expect(mockPush).toHaveBeenCalledWith("/auth/login");
	});

	it("mostra toast de erro quando a redefinição falha", async () => {
		const user = userEvent.setup();
		mockGet.mockReturnValue("token-valido");
		mockResetPasswordMutateAsync.mockRejectedValueOnce(new Error("expirado"));
		render(<ResetPasswordContent />);

		await user.type(
			screen.getByPlaceholderText("Mínimo 8 caracteres"),
			"novaSenha123",
		);
		await user.type(
			screen.getByPlaceholderText("Repita a nova senha"),
			"novaSenha123",
		);
		await user.click(screen.getByRole("button", { name: "Redefinir senha" }));

		await waitFor(() =>
			expect(toast.error).toHaveBeenCalledWith(
				"Link inválido ou expirado. Solicite uma nova redefinição de senha.",
			),
		);
		expect(screen.getByText("Criar nova senha")).toBeInTheDocument();
	});
});
