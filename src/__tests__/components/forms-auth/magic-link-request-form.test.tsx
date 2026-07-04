import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import MagicLinkRequestForm from "@/components/forms/auth/MagicLinkRequestForm";

describe("MagicLinkRequestForm", () => {
	it("renderiza o campo de e-mail e o botão de envio do link", () => {
		render(<MagicLinkRequestForm onSubmit={vi.fn()} isPending={false} />);
		expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Enviar link de acesso" }),
		).toBeInTheDocument();
	});

	it("chama onSubmit com o e-mail digitado quando o formulário é válido", async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		render(<MagicLinkRequestForm onSubmit={onSubmit} isPending={false} />);

		await user.type(screen.getByLabelText("E-mail"), "joao@teste.com");
		await user.click(
			screen.getByRole("button", { name: "Enviar link de acesso" }),
		);

		await waitFor(() =>
			expect(onSubmit).toHaveBeenCalledWith("joao@teste.com"),
		);
	});

	it("não chama onSubmit e exibe erro de validação quando o e-mail é inválido", async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		render(<MagicLinkRequestForm onSubmit={onSubmit} isPending={false} />);

		await user.type(screen.getByLabelText("E-mail"), "email-invalido");
		await user.click(
			screen.getByRole("button", { name: "Enviar link de acesso" }),
		);

		await waitFor(() =>
			expect(screen.getByText("E-mail inválido")).toBeInTheDocument(),
		);
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("desabilita o botão de envio quando isPending é true", () => {
		render(<MagicLinkRequestForm onSubmit={vi.fn()} isPending={true} />);
		expect(
			screen.getByRole("button", { name: "Enviar link de acesso" }),
		).toBeDisabled();
	});
});
