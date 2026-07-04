import { render, screen } from "@testing-library/react";
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

import AuthEmailSentConfirmation from "@/components/auth/AuthEmailSentConfirmation";
import AuthLeftPanel from "@/components/auth/AuthLeftPanel";
import AuthMobileLogo from "@/components/auth/AuthMobileLogo";

describe("AuthLeftPanel", () => {
	it("renderiza o nome da marca via Logo", () => {
		render(<AuthLeftPanel />);
		expect(screen.getByText("Consulta Fácil")).toBeInTheDocument();
	});

	it("renderiza o título de destaque do painel", () => {
		render(<AuthLeftPanel />);
		expect(screen.getByText(/Saúde conectada,/)).toBeInTheDocument();
	});

	it("renderiza as estatísticas de destaque", () => {
		render(<AuthLeftPanel />);
		expect(screen.getByText("10k+")).toBeInTheDocument();
		expect(screen.getByText("Consultas")).toBeInTheDocument();
		expect(screen.getByText("500+")).toBeInTheDocument();
		expect(screen.getByText("Profissionais")).toBeInTheDocument();
		expect(screen.getByText("98%")).toBeInTheDocument();
		expect(screen.getByText("Satisfação")).toBeInTheDocument();
	});

	it("renderiza a citação no rodapé do painel", () => {
		render(<AuthLeftPanel />);
		expect(
			screen.getByText(/A saúde é o maior bem que um ser humano pode possuir/),
		).toBeInTheDocument();
	});
});

describe("AuthMobileLogo", () => {
	it("renderiza o nome da marca", () => {
		render(<AuthMobileLogo />);
		expect(screen.getByText("Consulta Fácil")).toBeInTheDocument();
	});

	it("tem a classe lg:hidden no container raiz", () => {
		const { container } = render(<AuthMobileLogo />);
		expect(container.firstChild).toHaveClass("lg:hidden");
	});

	it("renderiza o ícone svg de check", () => {
		const { container } = render(<AuthMobileLogo />);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});
});

describe("AuthEmailSentConfirmation", () => {
	it("renderiza o título de confirmação e a descrição recebida", () => {
		render(
			<AuthEmailSentConfirmation
				description="Enviamos instruções para o seu e-mail."
				onRetry={vi.fn()}
			/>,
		);
		expect(screen.getByText("Verifique seu e-mail")).toBeInTheDocument();
		expect(
			screen.getByText("Enviamos instruções para o seu e-mail."),
		).toBeInTheDocument();
	});

	it("renderiza descrição em formato de nó React (jsx)", () => {
		render(
			<AuthEmailSentConfirmation
				description={
					<span>
						Enviado para <strong>fulano@teste.com</strong>
					</span>
				}
				onRetry={vi.fn()}
			/>,
		);
		expect(screen.getByText("fulano@teste.com")).toBeInTheDocument();
	});

	it("chama onRetry ao clicar em 'Tentar novamente'", async () => {
		const user = userEvent.setup();
		const onRetry = vi.fn();
		render(
			<AuthEmailSentConfirmation description="descrição" onRetry={onRetry} />,
		);
		await user.click(screen.getByText("Tentar novamente"));
		expect(onRetry).toHaveBeenCalledTimes(1);
	});
});
