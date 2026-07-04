import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PaymentResult } from "@/components/billing/PaymentResult";

describe("PaymentResult", () => {
	it("renderiza o titulo, descricao e icone recebidos", () => {
		render(
			<PaymentResult
				icon={<span data-testid="icone">icone</span>}
				title="Pagamento aprovado"
				description="Tudo certo com seu pagamento."
				buttonLabel="Voltar"
				buttonHref="/dashboard"
			/>,
		);
		expect(screen.getByText("Pagamento aprovado")).toBeInTheDocument();
		expect(
			screen.getByText("Tudo certo com seu pagamento."),
		).toBeInTheDocument();
		expect(screen.getByTestId("icone")).toBeInTheDocument();
	});

	it("renderiza o link com o href e o rotulo do botao corretos", () => {
		render(
			<PaymentResult
				icon={<span />}
				title="Titulo"
				description="Descricao"
				buttonLabel="Ir para o inicio"
				buttonHref="/home"
			/>,
		);
		const link = screen.getByRole("link", { name: "Ir para o inicio" });
		expect(link).toHaveAttribute("href", "/home");
	});

	it("aceita conteudo em ReactNode como descricao", () => {
		render(
			<PaymentResult
				icon={<span />}
				title="Titulo"
				description={<span>Descricao customizada</span>}
				buttonLabel="Ok"
				buttonHref="/ok"
			/>,
		);
		expect(screen.getByText("Descricao customizada")).toBeInTheDocument();
	});
});
