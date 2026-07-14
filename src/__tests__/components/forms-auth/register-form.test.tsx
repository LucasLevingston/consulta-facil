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

import { RegisterForm } from "@/components/forms/auth/registerForm";

describe("RegisterForm", () => {
	it("renderiza os campos de nome, cpf, e-mail, senha e confirmação de senha", () => {
		render(<RegisterForm onSubmit={vi.fn()} isPending={false} />);
		expect(screen.getByLabelText("Nome")).toBeInTheDocument();
		expect(screen.getByLabelText("CPF")).toBeInTheDocument();
		expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
		expect(screen.getAllByPlaceholderText("••••••")).toHaveLength(2);
		expect(
			screen.getByRole("button", { name: "Criar conta" }),
		).toBeInTheDocument();
	});

	it("renderiza o link para a página de login", () => {
		render(<RegisterForm onSubmit={vi.fn()} isPending={false} />);
		expect(screen.getByRole("link", { name: "Entrar" })).toHaveAttribute(
			"href",
			"/auth/login",
		);
	});

	it("chama onSubmit com os dados informados quando o formulário é válido", async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		render(<RegisterForm onSubmit={onSubmit} isPending={false} />);

		await user.type(screen.getByLabelText("Nome"), "Joao da Silva");
		await user.type(screen.getByLabelText("CPF"), "12345678900");
		await user.type(screen.getByLabelText("E-mail"), "joao@teste.com");
		const [password, confirmPassword] =
			screen.getAllByPlaceholderText("••••••");
		await user.type(password, "senha123456");
		await user.type(confirmPassword, "senha123456");
		await user.click(screen.getByRole("button", { name: "Criar conta" }));

		await waitFor(() => expect(onSubmit).toHaveBeenCalled());
		expect(onSubmit.mock.calls[0][0]).toEqual({
			name: "Joao da Silva",
			cpf: "12345678900",
			email: "joao@teste.com",
			password: "senha123456",
			confirmPassword: "senha123456",
		});
	}, 10000);

	it("não chama onSubmit e exibe erro de validação quando o e-mail é inválido", async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		render(<RegisterForm onSubmit={onSubmit} isPending={false} />);

		await user.type(screen.getByLabelText("Nome"), "Joao da Silva");
		await user.type(screen.getByLabelText("CPF"), "12345678900");
		await user.type(screen.getByLabelText("E-mail"), "email-invalido");
		const [password, confirmPassword] =
			screen.getAllByPlaceholderText("••••••");
		await user.type(password, "senha123456");
		await user.type(confirmPassword, "senha123456");
		await user.click(screen.getByRole("button", { name: "Criar conta" }));

		await waitFor(() =>
			expect(screen.getByText("E-mail inválido")).toBeInTheDocument(),
		);
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("desabilita o botão de criar conta quando isPending é true", () => {
		render(<RegisterForm onSubmit={vi.fn()} isPending={true} />);
		expect(screen.getByRole("button", { name: "Criar conta" })).toBeDisabled();
	});
});
