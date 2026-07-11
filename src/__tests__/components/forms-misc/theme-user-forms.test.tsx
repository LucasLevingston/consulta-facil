import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";

// jsdom não implementa ResizeObserver, mas o RadioGroup do radix-ui depende
// dele internamente (via @radix-ui/react-use-size) para medir o indicador.
beforeAll(() => {
	if (!("ResizeObserver" in globalThis)) {
		(globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver =
			class {
				observe() {}
				unobserve() {}
				disconnect() {}
			};
	}
});

vi.mock("@/components/ui/form", async () => {
	const { Controller } = await import("react-hook-form");
	return {
		Form: ({ children }: { children: React.ReactNode }) => (
			<div>{children}</div>
		),
		// biome-ignore lint/suspicious/noExplicitAny: mock repassa direto para o Controller real do react-hook-form
		FormField: (props: any) => <Controller {...props} />,
		FormItem: ({ children }: { children: React.ReactNode }) => (
			<div>{children}</div>
		),
		FormLabel: ({ children, ...rest }: { children: React.ReactNode }) => (
			<span {...rest}>{children}</span>
		),
		FormControl: ({ children }: { children: React.ReactNode }) => (
			<>{children}</>
		),
		FormMessage: () => null,
	};
});

import { ThemeOption } from "@/components/forms/ThemeOption";
import { RadioGroup } from "@/components/ui/radio-group";

describe("ThemeOption", () => {
	it("exibe o label e o conteúdo (children) recebidos", () => {
		render(
			<RadioGroup value="light" onValueChange={vi.fn()}>
				<ThemeOption value="light" label="Light" currentValue="light">
					<span>preview-light</span>
				</ThemeOption>
			</RadioGroup>,
		);

		expect(screen.getByText("Light")).toBeInTheDocument();
		expect(screen.getByText("preview-light")).toBeInTheDocument();
	});

	it("aplica a classe de destaque quando currentValue é igual ao value", () => {
		const { container } = render(
			<RadioGroup value="light" onValueChange={vi.fn()}>
				<ThemeOption value="light" label="Light" currentValue="light">
					<span>preview</span>
				</ThemeOption>
			</RadioGroup>,
		);

		expect(container.querySelector(".border-primary")).toBeInTheDocument();
	});

	it("aplica a classe neutra quando currentValue é diferente do value", () => {
		const { container } = render(
			<RadioGroup value="light" onValueChange={vi.fn()}>
				<ThemeOption value="dark" label="Dark" currentValue="light">
					<span>preview</span>
				</ThemeOption>
			</RadioGroup>,
		);

		expect(container.querySelector(".border-muted")).toBeInTheDocument();
		expect(container.querySelector(".border-primary")).not.toBeInTheDocument();
	});
});

vi.mock("next-themes", () => ({
	useTheme: vi.fn(),
}));
vi.mock("sonner", () => ({
	toast: { success: vi.fn(), error: vi.fn() },
}));

import { useTheme } from "next-themes";
import { toast } from "sonner";
import { ThemeForm } from "@/components/forms/theme-form";

const mockUseTheme = vi.mocked(useTheme);

describe("ThemeForm", () => {
	it("renderiza as opções de tema Light e Dark", () => {
		mockUseTheme.mockReturnValue({
			theme: "light",
			setTheme: vi.fn(),
		} as never);

		render(<ThemeForm />);

		expect(screen.getByText("Light")).toBeInTheDocument();
		expect(screen.getByText("Dark")).toBeInTheDocument();
		expect(screen.getByText("Salvar alterações")).toBeInTheDocument();
	});

	it("seleciona o tema Dark e, ao submeter, chama setTheme e exibe toast de sucesso", async () => {
		const user = userEvent.setup();
		const setTheme = vi.fn();
		mockUseTheme.mockReturnValue({ theme: "light", setTheme } as never);

		render(<ThemeForm />);

		const radios = screen.getAllByRole("radio");
		await user.click(radios[1]);
		await user.click(screen.getByText("Salvar alterações"));

		expect(setTheme).toHaveBeenCalledWith("dark");
		expect(toast.success).toHaveBeenCalledWith("Sucesso", {
			description: "O tema foi alterado para: dark",
		});
	});
});

vi.mock("@/components/ui/tabs", () => ({
	Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	TabsList: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	TabsTrigger: ({ children }: { children: React.ReactNode }) => (
		<button type="button">{children}</button>
	),
	TabsContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}));

vi.mock("@/components/forms/auth/LoginForm", () => ({
	default: ({
		onSubmit,
		isPending,
	}: {
		onSubmit: (values: { email: string; password: string }) => void;
		isPending: boolean;
	}) => (
		<div>
			<span>login-pending:{String(isPending)}</span>
			<button
				type="button"
				onClick={() =>
					onSubmit({ email: "user@teste.com", password: "123456" })
				}
			>
				submit-login
			</button>
		</div>
	),
}));

vi.mock("@/components/forms/auth/registerForm", () => ({
	RegisterForm: ({
		onSubmit,
		isPending,
	}: {
		onSubmit: (values: Record<string, string>) => void;
		isPending: boolean;
	}) => (
		<div>
			<span>register-pending:{String(isPending)}</span>
			<button
				type="button"
				onClick={() =>
					onSubmit({
						name: "Ana",
						email: "ana@teste.com",
						password: "123456",
						confirmPassword: "123456",
						cpf: "11144477735",
					})
				}
			>
				submit-register
			</button>
		</div>
	),
}));

vi.mock("next/navigation", () => ({
	useRouter: vi.fn(),
}));

vi.mock("@/components/auth/hooks", () => ({
	useLogin: vi.fn(),
	useRegister: vi.fn(),
}));

import { useRouter } from "next/navigation";
import { useLogin, useRegister } from "@/components/auth/hooks";
import { UserForm } from "@/components/forms/UserForm";

const mockUseRouter = vi.mocked(useRouter);
const mockUseLogin = vi.mocked(useLogin);
const mockUseRegister = vi.mocked(useRegister);

describe("UserForm", () => {
	it("renderiza as abas Registrar e Entrar", () => {
		mockUseRouter.mockReturnValue({ push: vi.fn() } as never);
		mockUseLogin.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: false,
		} as never);
		mockUseRegister.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: false,
		} as never);

		render(<UserForm />);

		expect(screen.getByText("Registrar")).toBeInTheDocument();
		expect(screen.getByText("Entrar")).toBeInTheDocument();
	});

	it("faz login com sucesso e redireciona para /dashboard", async () => {
		const user = userEvent.setup();
		const push = vi.fn();
		const loginMutateAsync = vi.fn().mockResolvedValue(undefined);
		mockUseRouter.mockReturnValue({ push } as never);
		mockUseLogin.mockReturnValue({
			mutateAsync: loginMutateAsync,
			isPending: false,
		} as never);
		mockUseRegister.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: false,
		} as never);

		render(<UserForm />);
		await user.click(screen.getByText("submit-login"));

		expect(loginMutateAsync).toHaveBeenCalledWith({
			email: "user@teste.com",
			password: "123456",
		});
		expect(push).toHaveBeenCalledWith("/dashboard");
	});

	it("exibe toast de erro quando o login falha", async () => {
		const user = userEvent.setup();
		mockUseRouter.mockReturnValue({ push: vi.fn() } as never);
		mockUseLogin.mockReturnValue({
			mutateAsync: vi.fn().mockRejectedValue(new Error("fail")),
			isPending: false,
		} as never);
		mockUseRegister.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: false,
		} as never);

		render(<UserForm />);
		await user.click(screen.getByText("submit-login"));

		expect(toast.error).toHaveBeenCalledWith("E-mail ou senha incorretos.");
	});

	it("registra o usuário, faz login em seguida e redireciona para completar o perfil", async () => {
		const user = userEvent.setup();
		const push = vi.fn();
		const registerMutateAsync = vi.fn().mockResolvedValue(undefined);
		const loginMutateAsync = vi.fn().mockResolvedValue(undefined);
		mockUseRouter.mockReturnValue({ push } as never);
		mockUseRegister.mockReturnValue({
			mutateAsync: registerMutateAsync,
			isPending: false,
		} as never);
		mockUseLogin.mockReturnValue({
			mutateAsync: loginMutateAsync,
			isPending: false,
		} as never);

		render(<UserForm />);
		await user.click(screen.getByText("submit-register"));

		expect(registerMutateAsync).toHaveBeenCalledWith({
			name: "Ana",
			email: "ana@teste.com",
			password: "123456",
			confirmPassword: "123456",
			cpf: "11144477735",
		});
		expect(loginMutateAsync).toHaveBeenCalledWith({
			email: "ana@teste.com",
			password: "123456",
		});
		expect(push).toHaveBeenCalledWith("/auth/complete-profile");
	});

	it("exibe toast de erro quando o registro falha", async () => {
		const user = userEvent.setup();
		mockUseRouter.mockReturnValue({ push: vi.fn() } as never);
		mockUseRegister.mockReturnValue({
			mutateAsync: vi.fn().mockRejectedValue(new Error("fail")),
			isPending: false,
		} as never);
		mockUseLogin.mockReturnValue({
			mutateAsync: vi.fn(),
			isPending: false,
		} as never);

		render(<UserForm />);
		await user.click(screen.getByText("submit-register"));

		expect(toast.error).toHaveBeenCalledWith("Erro ao registrar usuário.");
	});
});
