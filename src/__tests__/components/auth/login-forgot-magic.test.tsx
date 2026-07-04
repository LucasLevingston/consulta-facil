import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: mockPush, replace: mockReplace }),
	useSearchParams: () => new URLSearchParams(),
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

const mockLoginMutateAsync = vi.fn();
const mockForgotPasswordMutateAsync = vi.fn();
const mockMagicLinkMutateAsync = vi.fn();

vi.mock("@/features/auth", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/features/auth")>();
	return {
		...actual,
		useLogin: vi.fn(() => ({
			mutateAsync: mockLoginMutateAsync,
			isPending: false,
		})),
		useForgotPassword: vi.fn(() => ({
			mutateAsync: mockForgotPasswordMutateAsync,
			isPending: false,
		})),
		useMagicLinkRequest: vi.fn(() => ({
			mutateAsync: mockMagicLinkMutateAsync,
			isPending: false,
		})),
	};
});

import { toast } from "sonner";
import ForgotPasswordContent from "@/components/auth/ForgotPasswordContent";
import LoginContent from "@/components/auth/LoginContent";
import MagicLinkRequestContent from "@/components/auth/MagicLinkRequestContent";

describe("LoginContent", () => {
	const originalLocation = window.location;

	beforeEach(() => {
		vi.clearAllMocks();
		Object.defineProperty(window, "location", {
			writable: true,
			value: { ...originalLocation, href: "" },
		});
	});

	it("renderiza o formulário de login com campos e botão", () => {
		render(<LoginContent />);
		expect(screen.getByText("Bem-vindo de volta")).toBeInTheDocument();
		expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
		expect(screen.getByText("Senha")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
	});

	it("submete o form e navega para o dashboard em caso de sucesso", async () => {
		const user = userEvent.setup();
		mockLoginMutateAsync.mockResolvedValueOnce({});
		render(<LoginContent />);

		await user.type(screen.getByLabelText("E-mail"), "joao@teste.com");
		await user.type(screen.getByPlaceholderText("••••••"), "senha123");
		await user.click(screen.getByRole("button", { name: "Entrar" }));

		await waitFor(() =>
			expect(mockLoginMutateAsync).toHaveBeenCalledWith({
				email: "joao@teste.com",
				password: "senha123",
			}),
		);
		expect(toast.success).toHaveBeenCalledWith("Login feito com sucesso!");
		expect(mockPush).toHaveBeenCalledWith("/dashboard");
	});

	it("mostra toast de erro quando o login falha", async () => {
		const user = userEvent.setup();
		mockLoginMutateAsync.mockRejectedValueOnce(
			new Error("credenciais inválidas"),
		);
		render(<LoginContent />);

		await user.type(screen.getByLabelText("E-mail"), "joao@teste.com");
		await user.type(screen.getByPlaceholderText("••••••"), "senhaerrada");
		await user.click(screen.getByRole("button", { name: "Entrar" }));

		await waitFor(() =>
			expect(toast.error).toHaveBeenCalledWith("E-mail ou senha incorretos."),
		);
		expect(mockPush).not.toHaveBeenCalled();
	});

	it("redireciona para a rota de login do Google ao clicar no botão social", async () => {
		const user = userEvent.setup();
		render(<LoginContent />);
		await user.click(screen.getByRole("button", { name: "Entrar com Google" }));
		expect(window.location.href).toContain("/auth/google/redirect");
	});
});

describe("ForgotPasswordContent", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renderiza o formulário inicial de redefinição de senha", () => {
		render(<ForgotPasswordContent />);
		expect(screen.getByText("Redefinir senha")).toBeInTheDocument();
		expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
	});

	it("exibe a confirmação de envio de e-mail em caso de sucesso", async () => {
		const user = userEvent.setup();
		mockForgotPasswordMutateAsync.mockResolvedValueOnce(undefined);
		render(<ForgotPasswordContent />);

		await user.type(screen.getByLabelText("E-mail"), "joao@teste.com");
		await user.click(screen.getByRole("button", { name: "Enviar instruções" }));

		await waitFor(() =>
			expect(mockForgotPasswordMutateAsync).toHaveBeenCalledWith(
				"joao@teste.com",
			),
		);
		expect(screen.getByText("Verifique seu e-mail")).toBeInTheDocument();
		expect(screen.getByText("joao@teste.com")).toBeInTheDocument();
	});

	it("mostra toast de erro e mantém o formulário quando o envio falha", async () => {
		const user = userEvent.setup();
		mockForgotPasswordMutateAsync.mockRejectedValueOnce(new Error("falhou"));
		render(<ForgotPasswordContent />);

		await user.type(screen.getByLabelText("E-mail"), "joao@teste.com");
		await user.click(screen.getByRole("button", { name: "Enviar instruções" }));

		await waitFor(() =>
			expect(toast.error).toHaveBeenCalledWith(
				"Erro ao enviar e-mail. Tente novamente.",
			),
		);
		expect(screen.getByText("Redefinir senha")).toBeInTheDocument();
	});

	it("volta para o formulário ao clicar em 'Tentar novamente' após sucesso", async () => {
		const user = userEvent.setup();
		mockForgotPasswordMutateAsync.mockResolvedValueOnce(undefined);
		render(<ForgotPasswordContent />);

		await user.type(screen.getByLabelText("E-mail"), "joao@teste.com");
		await user.click(screen.getByRole("button", { name: "Enviar instruções" }));
		await waitFor(() =>
			expect(screen.getByText("Verifique seu e-mail")).toBeInTheDocument(),
		);

		await user.click(screen.getByText("Tentar novamente"));
		expect(screen.getByText("Redefinir senha")).toBeInTheDocument();
	});
});

describe("MagicLinkRequestContent", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renderiza o formulário inicial de link de acesso", () => {
		render(<MagicLinkRequestContent />);
		expect(screen.getByText("Link de acesso")).toBeInTheDocument();
		expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
	});

	it("exibe a confirmação de envio do link em caso de sucesso", async () => {
		const user = userEvent.setup();
		mockMagicLinkMutateAsync.mockResolvedValueOnce(undefined);
		render(<MagicLinkRequestContent />);

		await user.type(screen.getByLabelText("E-mail"), "joao@teste.com");
		await user.click(
			screen.getByRole("button", { name: "Enviar link de acesso" }),
		);

		await waitFor(() =>
			expect(mockMagicLinkMutateAsync).toHaveBeenCalledWith("joao@teste.com"),
		);
		expect(screen.getByText("Verifique seu e-mail")).toBeInTheDocument();
		expect(screen.getByText(/O link expira em 15 minutos/)).toBeInTheDocument();
	});

	it("mostra toast de erro quando o envio do link falha", async () => {
		const user = userEvent.setup();
		mockMagicLinkMutateAsync.mockRejectedValueOnce(new Error("falhou"));
		render(<MagicLinkRequestContent />);

		await user.type(screen.getByLabelText("E-mail"), "joao@teste.com");
		await user.click(
			screen.getByRole("button", { name: "Enviar link de acesso" }),
		);

		await waitFor(() =>
			expect(toast.error).toHaveBeenCalledWith(
				"Erro ao enviar o link. Tente novamente.",
			),
		);
	});
});
