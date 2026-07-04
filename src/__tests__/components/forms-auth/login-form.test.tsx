import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
	default: ({
		href,
		children,
	}: {
		href: string;
		children: React.ReactNode;
	}) => <a href={href}>{children}</a>,
}));

import LoginForm from "@/components/forms/auth/LoginForm";

describe("LoginForm", () => {
	it("renderiza os campos de e-mail e senha e o botão de entrar", () => {
		render(<LoginForm onSubmit={vi.fn()} isPending={false} />);
		expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("••••••")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
	});

	it("renderiza o link 'Esqueci minha senha' apontando para /auth/forgot-password", () => {
		render(<LoginForm onSubmit={vi.fn()} isPending={false} />);
		expect(
			screen.getByRole("link", { name: "Esqueci minha senha" }),
		).toHaveAttribute("href", "/auth/forgot-password");
	});

	it("chama onSubmit com e-mail e senha quando o formulário é válido", async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		render(<LoginForm onSubmit={onSubmit} isPending={false} />);

		await user.type(screen.getByLabelText("E-mail"), "joao@teste.com");
		await user.type(screen.getByPlaceholderText("••••••"), "senha123");
		await user.click(screen.getByRole("button", { name: "Entrar" }));

		await waitFor(() => expect(onSubmit).toHaveBeenCalled());
		expect(onSubmit.mock.calls[0][0]).toEqual({
			email: "joao@teste.com",
			password: "senha123",
		});
	});

	it("não chama onSubmit e exibe erro de validação quando o e-mail é inválido", async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		render(<LoginForm onSubmit={onSubmit} isPending={false} />);

		await user.type(screen.getByLabelText("E-mail"), "email-invalido");
		await user.type(screen.getByPlaceholderText("••••••"), "senha123");
		await user.click(screen.getByRole("button", { name: "Entrar" }));

		await waitFor(() =>
			expect(screen.getByText("E-mail inválido")).toBeInTheDocument(),
		);
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("desabilita o botão de entrar quando isPending é true", () => {
		render(<LoginForm onSubmit={vi.fn()} isPending={true} />);
		expect(screen.getByRole("button", { name: "Entrar" })).toBeDisabled();
	});
});
