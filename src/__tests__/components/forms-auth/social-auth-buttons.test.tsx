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

import SocialAuthButtons from "@/components/forms/auth/SocialAuthButtons";

describe("SocialAuthButtons", () => {
	it("renderiza o botão de entrar com Google e o link de link de acesso", () => {
		render(<SocialAuthButtons onGoogleClick={vi.fn()} />);
		expect(
			screen.getByRole("button", { name: "Entrar com Google" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: "Entrar com link no e-mail" }),
		).toHaveAttribute("href", "/auth/magic-link");
	});

	it("chama onGoogleClick ao clicar no botão do Google", async () => {
		const user = userEvent.setup();
		const onGoogleClick = vi.fn();
		render(<SocialAuthButtons onGoogleClick={onGoogleClick} />);

		await user.click(screen.getByRole("button", { name: "Entrar com Google" }));
		expect(onGoogleClick).toHaveBeenCalledTimes(1);
	});

	it("desabilita o botão do Google quando googleDisabled é true", () => {
		render(<SocialAuthButtons onGoogleClick={vi.fn()} googleDisabled />);
		expect(
			screen.getByRole("button", { name: "Entrar com Google" }),
		).toBeDisabled();
	});

	it("exibe 'Entrando...' e desabilita o botão quando googleLoading é true", () => {
		render(<SocialAuthButtons onGoogleClick={vi.fn()} googleLoading />);
		const button = screen.getByRole("button", { name: "Entrar com Google" });
		expect(button).toHaveTextContent("Entrando...");
		expect(button).toBeDisabled();
	});
});
