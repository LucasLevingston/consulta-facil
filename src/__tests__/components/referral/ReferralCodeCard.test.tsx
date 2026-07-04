import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReferralCodeCard } from "@/components/referral/ReferralCodeCard";

describe("ReferralCodeCard", () => {
	it("renderiza o codigo de indicacao quando nao esta carregando", () => {
		render(<ReferralCodeCard code="ABC123" isLoading={false} />);

		expect(screen.getByText("Seu codigo de indicacao")).toBeInTheDocument();
		expect(screen.getByText("ABC123")).toBeInTheDocument();
	});

	it("renderiza o botao de copiar junto com o codigo", () => {
		render(<ReferralCodeCard code="ABC123" isLoading={false} />);

		expect(screen.getByRole("button", { name: /copiar/i })).toBeInTheDocument();
	});

	it("renderiza o skeleton de carregamento quando isLoading e verdadeiro", () => {
		render(<ReferralCodeCard code="" isLoading />);

		expect(
			screen.queryByText("Seu codigo de indicacao"),
		).not.toBeInTheDocument();
	});
});
