import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import ResetPasswordForm from "@/components/forms/auth/ResetPasswordForm";

describe("ResetPasswordForm", () => {
	it("renderiza os campos de nova senha e confirmação, e o botão de redefinir", () => {
		render(<ResetPasswordForm onSubmit={vi.fn()} isPending={false} />);
		expect(
			screen.getByPlaceholderText("Mínimo 8 caracteres"),
		).toBeInTheDocument();
		expect(
			screen.getByPlaceholderText("Repita a nova senha"),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Redefinir senha" }),
		).toBeInTheDocument();
	});

	it("chama onSubmit com a nova senha quando as senhas conferem", async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		render(<ResetPasswordForm onSubmit={onSubmit} isPending={false} />);

		await user.type(
			screen.getByPlaceholderText("Mínimo 8 caracteres"),
			"novaSenha123",
		);
		await user.type(
			screen.getByPlaceholderText("Repita a nova senha"),
			"novaSenha123",
		);
		await user.click(screen.getByRole("button", { name: "Redefinir senha" }));

		await waitFor(() => expect(onSubmit).toHaveBeenCalledWith("novaSenha123"));
	});

	it("não chama onSubmit e exibe erro quando as senhas não conferem", async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		render(<ResetPasswordForm onSubmit={onSubmit} isPending={false} />);

		await user.type(
			screen.getByPlaceholderText("Mínimo 8 caracteres"),
			"novaSenha123",
		);
		await user.type(
			screen.getByPlaceholderText("Repita a nova senha"),
			"outraSenha456",
		);
		await user.click(screen.getByRole("button", { name: "Redefinir senha" }));

		await waitFor(() =>
			expect(screen.getByText("As senhas não conferem")).toBeInTheDocument(),
		);
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("não chama onSubmit e exibe erro quando a senha tem menos de 8 caracteres", async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		render(<ResetPasswordForm onSubmit={onSubmit} isPending={false} />);

		await user.type(screen.getByPlaceholderText("Mínimo 8 caracteres"), "123");
		await user.type(screen.getByPlaceholderText("Repita a nova senha"), "123");
		await user.click(screen.getByRole("button", { name: "Redefinir senha" }));

		await waitFor(() =>
			expect(
				screen.getAllByText("Senha deve ter pelo menos 8 caracteres")[0],
			).toBeInTheDocument(),
		);
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("desabilita o botão de redefinir quando isPending é true", () => {
		render(<ResetPasswordForm onSubmit={vi.fn()} isPending={true} />);
		expect(
			screen.getByRole("button", { name: "Redefinir senha" }),
		).toBeDisabled();
	});
});
