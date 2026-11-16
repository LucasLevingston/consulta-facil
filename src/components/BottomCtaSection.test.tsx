import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BottomCtaSection } from "./BottomCtaSection";

describe("BottomCtaSection", () => {
	it("invites the visitor to start", () => {
		render(<BottomCtaSection />);

		expect(
			screen.getByRole("heading", { name: "Pronto para começar?" }),
		).toBeInTheDocument();
	});

	it("links to free sign up and to the professionals list", () => {
		render(<BottomCtaSection />);

		expect(
			screen.getByRole("link", { name: /Criar conta grátis/ }),
		).toHaveAttribute("href", "/auth/register");
		expect(
			screen.getByRole("link", { name: "Explorar profissionais" }),
		).toHaveAttribute("href", "/professionals");
	});
});
